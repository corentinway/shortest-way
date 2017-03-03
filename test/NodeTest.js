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
	})

	it( 'should return empty list if there is no path between nodes (3 nodes)', function () {
		var n1 = new Node( { id: 'n1' } );
		var n2 = new Node( { id: 'n2' } );
		var n3 = new Node( { id: 'n3' } );

		n2.addNext( n3, 1 );
		n3.addNext( n1, 1 );

		var path = n1.compute(n2, [n1, n2, n3]);
		assert.equal(path.length, 0);
	})

	it( 'should return empty list if there is no path between nodes (4 nodes)', function () {
		var n1 = new Node( { id: 'n1' } );
		var n2 = new Node( { id: 'n2' } );
		var n3 = new Node( { id: 'n3' } );
		var n4 = new Node( { id: 'n4' } );

		n2.addNext( n3, 1 );
		n3.addNext( n1, 1 );
		n3.addNext( n4, 1 );

		var path = n1.compute(n2, [n1, n2, n3]);
		assert.equal(path.length, 0);
	})
	
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
