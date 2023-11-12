export interface RouteDefinition {
	// Path to the route
	param: string;
	// HTTP Request method (get, post, ...)
	method: string; // 'get' | 'post' | 'delete' | 'options' | 'put';
	// Method name within our class responsible for this route
	action: string;
}
