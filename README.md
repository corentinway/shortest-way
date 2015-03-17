# About

Tihs module is an implementation of the Dijkstra's Algorithm to compute the shortest path
between a starting and ending node ina graph

# API

We provide one class <code>Node</code> to create a node, that connect to other nodes and which have the compute method
to compute the shortest path from the starting node till the ending node.

You load it like this

```javascript
var Node = require( 'shortest-way' ).Node;
```

### Construcor

The constructor takes one parameter as an object:

```javascript
Node( object )
```

* <code>object</code> is an object with 3 properties
  * <code>id</code> is the mandatory unique identifier of the node.
  * <code>raw</code> is any data you want to embed in the node. It is optional.
  * <code>offset</code> is an offset to add for each next node added. See the method <code>addNext</code>. It is optional.

For example :

```javascript
var Node = require( 'shortest-way' ).Node;
var start = new Node( { id:'start', raw: { cityName: 'Paris'} } );
```

### Building the graph

The node class has a method to add a <em>next</em> node. Hence you build a directional relation between 2 nodes.

```javascript
node.addNode( nextNode, weight )
```

This method takes 2 parameters:
* <code>nextNode</code> is the next node to add to this node
* <code>weight</code> is the weight of the relation between this node and the next node. It is 
a positive number and its detault value is <code>0</code>. You can concider 
  * it as the <em>distance</em> between 2 nodes
  * or the <em>time</em> it takes between 2 nodes.
  
An error is raised if
* the next node is already was already added to this node
* the <code>weight</code> is negative

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

### compute the shortest path

Once all nodes are created and linked together with the method <code>addNext</code>, you can call the 
<code>compute</code> method on the <em>starting node</em>.

```javascript
var path = startNode.compute( endNode, allNodes )
```

The arguments are :
* <code>endNode</code> is the destination for the shortest path you want to compute
* <code>allNodes</code> is an array containing all the nodes of the graph

Both arguments are required.

The result of the <code>compute</code> method is :

```javascript
[ 
{ 
  raw: undefined,
  id: 'A',
  offset: 0,
  value: 0,
  next: { B: [Object], C: [Object], E: [Object] },
  toString: [Function] 
},
{ 
  raw: undefined,
  id: 'C',
  offset: 0,
  value: 217,
  next: { G: [Object], H: [Object] },
  toString: [Function],
  prev:
  { raw: undefined,
  id: 'A',
  offset: 0,
  value: 0,
  next: [Object],
  toString: [Function] } 
  },
{ 
  raw: undefined,
  id: 'H',
  offset: 0,
  value: 320,
  next: { D: [Object], J: [Object] },
  toString: [Function],
  prev:
  { raw: undefined,
  id: 'C',
  offset: 0,
  value: 217,
  next: [Object],
  toString: [Function],
  prev: [Object] } 
},
{ 
  raw: undefined,
  id: 'J',
  offset: 0,
  value: 487,
  next: {},
  toString: [Function],
  prev:
  { raw: undefined,
  id: 'H',
  offset: 0,
  value: 320,
  next: [Object],
  toString: [Function],
  prev: [Object] } 
} 
]
```

Each element of the array is a <em>node</em> enhanced with some value. 
* <code>raw</code>, <code>id</code>, <code>offset</code> 
are values given to the node when its constructor was called (<code>new Node( {id:'', offset:0, raw: {} } )</code>).
* <code>next</code> was populated by the method <code>addNext</code>. This object contains all next node of this node.
* <code>toString</code> a function to nicely display a node
* <code>prev</code> was created while computing the shortest path. It is a reference with the previous nearest node.


Calling <code>JSON.stringify( results )</code> will lead to an error
<em>TypeError: Converting circular structure to JSON</em>. To avoid this, you can remove the previous and next node for each
element of the array.

```javascript
results.forEach( function ( node ) {
  delete node.next;
  delete node.prev;
} );
```

But if you want to keep the relation between nodes, you can do has follow to keep <code>node.id</code> in the place
of <code>next</code> and <code>prev</code>.

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


