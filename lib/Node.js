/**
 * implementaion of the Dijkstra's Algorithm
 * 
 * http://fr.wikipedia.org/wiki/Algorithme_de_Dijkstra
 * 
 */
var DEBUG_ENABLED = process.env.SHORTEST_WAY_DEBUG_ENABLED ? true : false;
/**************************************************
 * Model
 ***************************************************/
 
var debug = function( message ) {
	if( DEBUG_ENABLED ) {
		console.log( message );
	}
};

/**
* one node of the path
* @param data - the data that goes with this node.
* @param data.raw - raw data of the object
* @param data.id - identifier of the node
* @param data.offset - optional extra weight that is added for each next node of this one
* @param start {boolean} true if this is the start node
*/
function Node( data ) {
    /** does this not is the starting point: true -> start, flase -> end */
    /** raw data embedded with this node */
    this.raw = data.raw;
    
    /** a unique identifier of this node */     
    this.id = data.id;
    
    /** offset for the weight when a next node is added */
    this.offset = data.offset || 0;
    
    /** the value that is use to compute the shortest path: distance, executing time */
    this.value = Number.MAX_VALUE;
    
    /** links to the next Node */ 
    this.next = {};
    
    this.toString = function () {
        return this.id  + '[ ' + this.value  +' ]';
    };
}
 
module.exports = Node;

/**
* Add a node
* @param node {Node} node to add
*/
Node.prototype.addNext = function ( node, weight ) {
	weight = weight || 0;
	if ( weight < 0 ) {
		throw new Error( 'The weight must be greater or equal to zero' );
	}
	if ( this.next.hasOwnProperty( node.id ) ) {
		throw new Error( 'The node ' + node.id + ' was already added' );
	} else {
		this.next[ node.id ] = {
			node: node,
			weight: weight + this.offset
		};
	}
}

/**
* find the nearest node among all nodes of the graph
* @param nodes {Array} arrays of Node
*/
function findNearest( nodes ) {
	debug( '\nfind nearest node amond all nodes: ' + nodes );
    var nearest;
    for ( var i = 0; i < nodes.length; i++ ) {
        var node = nodes[i];
        if ( !nearest ) {
            nearest = node;
        } else if ( nearest.value > node.value ) {
            nearest = node;
        }
    }
	
	debug( 'Nearest is: ' + nearest );
    
    return nearest;
}
/**
* remove a node into a node list.
* 
* We browse all nodes looking node whose identifier match.
* 
* @param nodes {Array} array of nodes to remove
* @param node {Object} node to remove.
*/
function removeNode( nodes, node ) {
    
    for ( var i = 0; i < nodes.length; i++ ) {
        if ( nodes[i].id === node.id ) {
            // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/splice
            nodes.splice( i, 1 );
            return ;
        }
    }
}
/**
* update next element of the node
* - update the cumulative value 
* - update the predecessor
* @param n1 {Object} node element
*/
function updateNextNode( n1 ) {
	debug( 'update next nodes: ' + n1 );
	var id;
	for ( id in n1.next ) {
	
		var n2 = n1.next[ id ].node;
		var distance = n1.next[ id ].weight;
		
		debug( ' - next: ' + n2 + ' with distance: ' + distance );
		debug( '   n2.value > n1.value + distance ?' );
		
        if ( n2.value > n1.value + distance ) {
			debug( '   YES : ' + n2.value + ' > ' + n1.value + ' + ' + distance );
            n2.value = n1.value + distance;
            n2.prev = n1;
			debug( '   updating n2: ' + n2.toString() );
        } else {
			debug( '   NO  : ' + n2.value + ' > ' + n1.value + ' + ' + distance );
		}
		
    }
}
/**
* update all nodes: browse all nodes and update each distance and value
* @param nodes {Array} array of nodes to update
*/
function updateAllNodes ( allNodes ) {
	debug( 'update all nodes: ' + allNodes );
    while( allNodes.length > 0 ) {
        var n1 = findNearest( allNodes );
        removeNode( allNodes, n1 );
        updateNextNode( n1 );
    }
}
/**
* Compute the path between the starting node and the ending node
*/
function computePath ( startingNode, endingNode ) {
    var path = [];
    var n = endingNode;
    while ( n && n.id !== startingNode.id ) {
        // insert at the beggining
        // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/unshift
        path.unshift( n );
        n = n.prev;
    }
    
    path.unshift( startingNode );
    
    return path;
}
 
/**
* compute the shortest path from this starting node an ending node
*/
Node.prototype.compute = function ( endingNode, allNodes ) {
    
    var startingNode = this;
    startingNode.value = 0;
    
    updateAllNodes( allNodes );
    
    return computePath( startingNode, endingNode );

};

