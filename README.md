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

* <code>object</code> is an object with 2 properties
  * <code>id</code> is the mandatory unique identifier of the node
  * <code>raw</code> is any data you want to embed in the node. It is optional

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

# Examples

Here is the graph we want to give a try :

<img src='http://91.68.209.8/bmi/upload.wikimedia.org/wikipedia/commons/thumb/2/29/DijkstraBis01.svg/350px-DijkstraBis01.svg.png'>
from [Wikipedia](http://fr.wikipedia.org/wiki/Algorithme_de_Dijkstra)



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

```

