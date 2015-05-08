[![Build Status](https://travis-ci.org/corentinway/shortest-way.png?branch=master)](https://travis-ci.org/corentinway/shortest-way)

# About
Tihs module is an implementation of the Dijkstra's Algorithm to compute the shortest path between a starting and ending node ina graph

# API
We provide one class `Node` to create a node, that connect to other nodes and which have the compute method to compute the shortest path from the starting node till the ending node.

You load it like this

```javascript
var Node = require( 'shortest-way' ).Node;
```

## Construcor
The constructor takes one parameter as an object:

```javascript
Node( object )
```

- `object` is an object with 3 properties
  - `id` is the mandatory unique identifier of the node.
  - `offset` is an offset to add for each next node added. See the method `addNext`. It is optional.

For example :

```javascript
var Node = require( 'shortest-way' ).Node;
var start = new Node( { id:'start' } );
start.raw = { cityName: 'Paris'};
```

## Building the graph
The node class has a method to add a _next_ node. Hence you build a directional relation between 2 nodes.

```javascript
node.addNode( nextNode, weight )
```

This method takes 2 parameters:
- `nextNode` is the next node to add to this node
- `weight` is the weight of the relation between this node and the next node. It is
- a positive number and its detault value is `0`. You can concider
  - it as the _distance_ between 2 nodes
  - or the _time_ it takes between 2 nodes.

An error is raised if
- the next node is already was already added to this node
- the `weight` is negative

Example:

```javascript
var Node = require( 'shortest-way' ).Node;

// create nodes
var startNode = new Node( { id: 'start' } );
var middleNode = new Node( { id: 'middle' } );
var endNode = new Node( { id: 'end' } );

// add relation
startNode.addNext( middleNode, 1 );
middleNode.addNext( endNode, 1 );
```

## compute the shortest path
Once all nodes are created and linked together with the method `addNext`, you can call the `compute` method on the _starting node_.

```javascript
var path = startNode.compute( endNode, allNodes )
```

The arguments are :
- `endNode` is the destination for the shortest path you want to compute
- `allNodes` can be
  - an `array` containing all the nodes of the graph
  - an `object` containing all nodes of the graph.

```javascript
var startNode = new Node( { id: 'start' } );
var middleNode = new Node( { id: 'middle' } );
var endNode = new Node( { id: 'end' } );

// all nodes stored into an array
var allNodes = [ statNode, middleNode, endNode ];

var result = startNode.compute( endNode, allNodes );

// OR all nodes stored into an object
allNodes = {
  'start': startNode,
  'middle': middleNode,
  'end': endNode
};

var result = startNode.compute( endNode, allNodes );
```

Both format for `allNodes` are supported. If `allNodes` is an `array`, then it will be converted **once** into an object before computing the shortest path because it if faster to compute with an object containing all nodes.

Both arguments are required : `endNode` and `allNodes`.

The result of the `compute` method is :

```javascript
[
{
  id: 'A',
  offset: 0,
  value: 0,
  next: { B: [Object], C: [Object], E: [Object] },
  toString: [Function]
},
{
  id: 'C',
  offset: 0,
  value: 217,
  next: { G: [Object], H: [Object] },
  toString: [Function],
  prev:
  {
  id: 'A',
  offset: 0,
  value: 0,
  next: [Object],
  toString: [Function] }
  },
{
  id: 'H',
  offset: 0,
  value: 320,
  next: { D: [Object], J: [Object] },
  toString: [Function],
  prev:
  {
  id: 'C',
  offset: 0,
  value: 217,
  next: [Object],
  toString: [Function],
  prev: [Object] }
},
{
  id: 'J',
  offset: 0,
  value: 487,
  next: {},
  toString: [Function],
  prev:
  {
  id: 'H',
  offset: 0,
  value: 320,
  next: [Object],
  toString: [Function],
  prev: [Object] }
}
]
```

Each element of the array is a _node_ enhanced with some value.
- id`,`offset`
- are values given to the node when its constructor was called (`new Node( {id:'', offset:0 } )`).
- `next` was populated by the method `addNext`. This object contains all next node of this node.
- `toString` a function to nicely display a node
- `prev` was created while computing the shortest path. It is a reference with the previous nearest node.

Calling `JSON.stringify( results )` will lead to an error _TypeError: Converting circular structure to JSON_. To avoid this, you can remove the previous and next node for each element of the array.

```javascript
results.forEach( function ( node ) {
  delete node.next;
  delete node.prev;
} );
```

But if you want to keep the relation between nodes, you can do has follow to keep `node.id` in the place of `next` and `prev`.

```javascript
results.forEach( function ( node ) {
  node.next = Object.keys( node.next );
  node.prev = node.prev ? node.prev.id : undefined;
} );
```

# Examples
Here is the graph we want to give a try from [Wikipedia](http://fr.wikipedia.org/wiki/Algorithme_de_Dijkstra)

```javascript
var Node = require( 'shortest-way' ).Node;

var a = new Node( { id: 'A' }, true );
var b = new Node( { id: 'B' } );
var c = new Node( { id: 'C' } );
var d = new Node( { id: 'D' } );
var e = new Node( { id: 'E' } );
var f = new Node( { id: 'F' } );
var g = new Node( { id: 'G' } );
var h = new Node( { id: 'H' } );
var i = new Node( { id: 'I' } );
var j = new Node( { id: 'J' } );

a.addNext( b, 85 );
a.addNext( c, 217 );
a.addNext( e, 173 );

b.addNext( f, 80 );

c.addNext( g, 186 );
c.addNext( h, 103 );

h.addNext( d, 183 );

f.addNext( i, 250 );
i.addNext( j, 84 );

h.addNext( j, 167 );
e.addNext( j, 502 );

// call
var allNodes = [ a, b, c, d, e, f, g, h, i, j ];
var results = a.compute( j, allNodes );

var path = results.map( function ( node ) {
  return node.id
} ).join( ', ' );

console.log( path );
```

will output :

```javascript
A, C, H, J
```
