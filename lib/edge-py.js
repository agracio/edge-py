var path = require('path');

exports.getCompiler = function () {
	return process.env.EDGE_PY_NATIVE || ( process.env.EDGE_USE_CORECLR ? path.join(__dirname, 'edge-py-coreclr.dll') : path.join(__dirname, 'edge-py.dll'));
};

exports.getBootstrapDependencyManifest = function() {
	return path.join(__dirname, 'edge-py-coreclr.deps.json');
}

