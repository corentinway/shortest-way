/*jslint node: true, white: true, vars:true, plusplus: true */
/*global describe, it */

'use strict';

// TODO coverage

var Node = require( '../lib/Node' );
var assert = require( 'chai' ).assert;

var assetIsSet = function ( results, expectedLength ) {
	assert.isDefined( results );
	assert.isNotNull( results );
	assert.isArray( results );
	assert.lengthOf( results, expectedLength );
};


describe( 'Node', function () {

	it( 'shoud compute a graph with 1 node', function () {
		// input
		var startNode = new Node( { id: 'start' } );		
		// call
		var results = startNode.compute( startNode, [ startNode ] );
		// assertions
		assetIsSet( results, 1 );
	} );
	it( 'shoud compute a graph with a 2 nodes', function () {
		// input
		var startNode = new Node( { id: 'start' } );		
		var endNode = new Node( { id: 'end' } );		
		startNode.addNext( endNode, 1 );
		// call
		var results = startNode.compute( endNode, [ startNode, endNode ] );
		// assertions
		assetIsSet( results, 2 );
		assert.equal( results[0].id, 'start' );
		assert.equal( results[1].id, 'end' );
	} );
	it( 'shoud compute a graph with a 3 nodes', function () {
		// input
		var startNode = new Node( { id: 'start' } );		
		var middleNode = new Node( { id: 'middle' } );		
		var endNode = new Node( { id: 'end' } );		
		startNode.addNext( middleNode, 1 );
		middleNode.addNext( endNode, 1 );
		// call
		var results = startNode.compute( endNode, [ startNode, endNode, middleNode ] );
		// assertions
		assetIsSet( results, 3 );
		assert.equal( results[0].id, 'start' );
		assert.equal( results[1].id, 'middle' );
		assert.equal( results[2].id, 'end' );
	} );
	it( 'shoud compute a graph with a 4 nodes graph with all nodes connected each other', function () {
		var startNode = new Node( { id: 'start' }, true );		
		var middle1Node = new Node( { id: 'middle1' } );		
		var middle2Node = new Node( { id: 'middle2' } );		
		var endNode = new Node( { id: 'end' } );
		
		startNode.addNext( middle1Node, 1 );
		startNode.addNext( middle2Node, 2 );
		
		middle1Node.addNext( middle2Node, 4 );
		middle2Node.addNext( middle1Node, 4 );
		
		middle1Node.addNext( endNode, 10 );
		middle2Node.addNext( endNode, 8 );
		
//		console.log( '            start                  ' );
//		console.log( '         /          \\             ' );
//		console.log( '        1            2             ' );
//		console.log( '        |            |             ' );
//		console.log( '    middle1  --4--> middle2        ' );
//		console.log( '    middle1  <-4--- middle2        ' );
//		console.log( '        |            |             ' );
//		console.log( '        10           8             ' );
//		console.log( '          \\        /              ' );
//		console.log( '              end                  ' );
		
		
		// call
		var allNodes = [ startNode, endNode, middle1Node, middle2Node ];
		var results = startNode.compute( endNode, allNodes );
		// assertions
		assetIsSet( results, 3 );
//		console.log( results );
		assert.equal( results[0].id, 'start' );
		assert.equal( results[1].id, 'middle2' );
		assert.equal( results[2].id, 'end' );
		
	} );
	it( 'shoud compute a graph with a 2 nodes with many path between both nodes (transitions)', function () {
		// input
		var startNode = new Node( { id: 'start' } );		
		var endNode = new Node( { id: 'end' } );		
		
		var allNodes = [ startNode, endNode ];
		
		allNodes.push( startNode.addTransition( endNode, 1 ) );
		allNodes.push( startNode.addTransition( endNode, 2 ) );
		allNodes.push( startNode.addTransition( endNode, 3 ) );
		// call
		var results = startNode.compute( endNode, allNodes );
		// assertions
		assetIsSet( results, 3 );
		assert.equal( results[0].id, 'start' );
		assert.equal( results[1].id, 'transition:start>1>end' );
		assert.equal( results[2].id, 'end' );
	} );
	
	it( '#addTransition should setup options correctly', function () {
		var startNode = new Node( { id: 'start' } );
		var endNode = new Node( { id: 'end' } );		
		
		var options = {
			id: 'foo',
			prefixId: 'bar',
			startWeight: 3
		};
		var transition = startNode.addTransition( endNode, 40, options );
		
		assert.isDefined( transition );
		assert.isNotNull( transition );
		assert.equal( transition.id, 'foo' );
		assert.equal( startNode.next.foo.weight, 3 );		
	} );
	
	it( 'should return empty list if there is no path between nodes (2 nodes)', function () {
		var n1 = new Node( { id: 'n1' } );
		var n2 = new Node( { id: 'n2' } );

		var path = n1.compute(n2, [n1, n2]);
		assert.equal(path.length, 0);
	});

	it( 'should return empty list if there is no path between nodes (3 nodes)', function () {
		var n1 = new Node( { id: 'n1' } );
		var n2 = new Node( { id: 'n2' } );
		var n3 = new Node( { id: 'n3' } );

		n2.addNext( n3, 1 );
		n3.addNext( n1, 1 );

		var path = n1.compute(n2, [n1, n2, n3]);
		assert.equal(path.length, 0);
	});

	it( 'should return empty list if there is no path between nodes (4 nodes)', function () {
		var n1 = new Node( { id: 'n1' } );
		var n2 = new Node( { id: 'n2' } );
		var n3 = new Node( { id: 'n3' } );
		var n4 = new Node( { id: 'n4' } );

		n2.addNext( n3, 1 );
		n3.addNext( n1, 1 );
		n3.addNext( n4, 1 );

		var path = n1.compute(n2, [n1, n2, n3, n4]);
		assert.equal(path.length, 0);
	});
	
	it( 'should return empty list if there is no path between nodes (5 nodes)', function () {
		var n1 = new Node( { id: 'n1' } );
		var n2 = new Node( { id: 'n2' } );
		var n3 = new Node( { id: 'n3' } );
		var n4 = new Node( { id: 'n4' } );
		var n5 = new Node( { id: 'n5' } );

		n1.addNext( n2, 1 );
		n1.addNext( n3, 1 );
		n1.addNext( n4, 1 );
		n2.addNext( n1, 1 );
		n2.addNext( n3, 1 );
		n2.addNext( n4, 1 );
		n3.addNext( n1, 1 );
		n3.addNext( n2, 1 );
		n3.addNext( n4, 1 );
		n4.addNext( n1, 1 );
		n4.addNext( n2, 1 );
		n4.addNext( n3, 1 );
		
		n5.addNext( n1, 1 );
		n5.addNext( n2, 1 );
		n5.addNext( n3, 1 );
		n5.addNext( n4, 1 );

		var path = n1.compute(n5, [n1, n2, n3, n4, n5]);
		assert.equal(path.length, 0);
	});
	
	it( '#connectWith should work correctly', function () {
		var n1 = new Node( { id: 'n1' } );
		var n2 = new Node( { id: 'n2' } );

		n1.connectWith( n2, 1 );

		assert.equal( n1.id in n2.next, true );
		assert.equal( n2.id in n1.next, true );
	});
	
	it( 'indirected graphs', function () {
		// for issue #1 - 
		// https://github.com/corentinway/shortest-way/issues/1

		var nodes = {
			startNode: new Node( { id: 'startNode' } ),
			middleNode1: new Node( { id: 'middleNode1' } ),
			middleNode2: new Node( { id: 'middleNode2' } ),
			middleNode3: new Node( { id: 'middleNode3' } ),
			endNode: new Node( { id: 'endNode' } )
		};

		// add relation
		nodes.startNode.connectWith(nodes.middleNode1, 1.9);
		nodes.startNode.connectWith(nodes.middleNode2, 1.7);
		nodes.middleNode1.connectWith(nodes.endNode, 1);
		nodes.middleNode2.connectWith(nodes.middleNode3, 0.01);
		nodes.middleNode3.connectWith(nodes.endNode, 1);

		var pathFromArray = nodes.endNode.compute(nodes.startNode, 
			Object.keys(nodes).map((key) => nodes[key]));
		assert.deepEqual(pathFromArray.map((node) => node.id), 
			['endNode', 'middleNode3','middleNode2', 'startNode']);
		});
} );

/*

function describe( text, callback ) {
	console.log( text );
	callback();
}
function done( err ) {
	if ( err ) {
		console.error( 'FAILURE ');
		console.error( err );
	} else {
		console.log( 'SUCCESS' );
	}
}
function it( text, callback ) {
	console.log( '  ' + text );
	callback( done );
}
function iit() {}

*/
