import { Component, OnInit, Inject, HostListener, AfterViewChecked } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';

import { URLSearchParams } from "@angular/http";

import { HierarchyService } from './hierarchy.service';
import { HierarchyResult } from './hierarchy.result';
import { APP_CONFIG, IAppConfig } from './app.config';

import { Network, DataSet } from 'vis';

@Component({
	selector: 'hierarchy-component',
	templateUrl: './hierarchy.component.html',
})

export class HierarchyComponent implements OnInit, AfterViewChecked {
	private results: HierarchyResult[]; //results of the API call
	private error: any; //result diagnostics and errors 
	private loading: boolean = false; //progress loader
	private completed: boolean = false;

	private contactUrl: string = this.config.ERROR_MESSAGE_URL;  //contact url to display in error message

	private network: Network;
	private nodes: DataSet<any>;

	constructor(
		private hierarchyService: HierarchyService,
		// private activatedRoute: ActivatedRoute,
		// private router: Router,

		@Inject(APP_CONFIG)
		private config: IAppConfig) { }


	/*
	*	initialize hierarchy component:
	* 	get query params
	*	get term hierarchy
	*/
	ngOnInit(): void{

		/*
		*	inelegant but working version
		*/

		let normalizedQueryString: string;
		let uri: string;
		let terminology_id: string;

		if (window.location.search.indexOf('?') == 0) {
			normalizedQueryString = window.location.search.substring(1);
		} else { 
			normalizedQueryString = window.location.search;
		}

		let params = new URLSearchParams(normalizedQueryString);

		uri = params.paramsMap.get('uri') ? params.paramsMap.get('uri')[0] : null;
		terminology_id = params.paramsMap.get('terminology_id') ? params.paramsMap.get('terminology_id')[0] : null;

		// params.paramsMap.forEach(function(val, key) {
		// 	if (key.toLowerCase().startsWith('uri')) {
		// 		uri = val[0];
		// 	} else if (key.toLowerCase().startsWith('terminology')) {
		// 		terminology_id = val[0];
		// 	} else {
		// 		console.log('error in url params', key);
		// 	}
		// });

		/*
		*	official but not working version
		*/

		// // subscribe to router event
		// this.activatedRoute.params.subscribe((params: Params) => {
			// 	console.log(params);
			// 	let uri = params['uri'];
			// 	console.log(uri);
			// });

			// this.activatedRoute.queryParams.subscribe((params: Params) => {
				// 	console.log(params);
				// 	let uri = params['uri'];
				// 	console.log(uri);
				// });


		/*
		*	older official but not working version
		*/

		// this.router.routerState.root.queryParams.subscribe((params) => {
			// 	console.log(params);
			// })

			if(uri != null && terminology_id != null){
				this.getHierarchy(terminology_id, uri);
			} else if (uri == null && terminology_id == null) {
				console.log('empty url params');
			}else{
				console.log('wrong url params. please use "terminology_id" and "uri"', params.paramsMap);
			}
		}

		ngAfterViewChecked(): void {
			if (this.completed){
				window.dispatchEvent(new Event('resize'));
				this.completed = false;
			}
		}

		getHierarchy(terminologyId: string, uri: string): void {
			this.loading = true;
			this.error = null;
			this.hierarchyService.getHierarchy(terminologyId, uri)
				.subscribe(
					results => {
						this.results = results['results'];

						if (results['diagnostics'].length > 0) {
							this.error = results['diagnostics'];
							console.log('server diagnostics receiving the hierarchy');
							console.log(this.error);
						}

						this.loading = false;

						if (this.results.length > 0) {
							this.createHierarchyVisualisation(terminologyId, this.results[0].uri);
						}
					},
					err => {
						this.error = err;
						this.loading = false;
						this.completed = true;

						console.log(err);
					},
					() => {
						console.log('hierarchy received');
						this.completed = true;
					}
				);
		}

		createHierarchyVisualisation(terminologyId: string, startNodeUri: string): void {
			this.nodes = new DataSet([]);
			let edges = new DataSet([]);

			let isTaxonomy = true;

			for (let r of this.results) {
				this.nodes.add({ id: r.uri, label: r.label });
			}
			// this.nodes.add({ id: this.config.HIERARCHY_ROOT_ID, label: terminologyId.toUpperCase() + ' root' });

			for (let r of this.results) {
				if (r.hierarchy.length == 0) {
					// edges.add({ from: r.uri, to: this.config.HIERARCHY_ROOT_ID }); //add root element as last element
				} else if (r.hierarchy.length > 1){
					isTaxonomy = isTaxonomy && false;
				}

				for (let e of r.hierarchy) {
					edges.add({ from: r.uri, to: e });
				}
			}

			this.autoResize(isTaxonomy);

			this.network = new Network(
				document.getElementById('networkView'), //container
				{	//data
					nodes: this.nodes,
					edges: edges
				},
				{	//options
					autoResize: true,
					height: '100%',
					width: '100%',

					// configure: {
						// 	enabled: true,
						// 	filter: true,
						// 	showButton: true
						// },

					layout: {
						randomSeed: 549165, //979095, //50853, //536234 //343729
						improvedLayout: true,
					},

					interaction: {
						navigationButtons: true,
						zoomView: true,
					},

					edges: {
						arrows: {
							to: { enabled: true, scaleFactor: 1, type: 'arrow' },
							from: { enabled: false, scaleFactor: 1, type: 'arrow' }
						},
						color: {
							color: '#848484',
							highlight: '#848484',
							hover: '#848484',
							inherit: 'from',
							opacity: 1.0
						},
						length: 100,
						smooth: {
							enabled: true,
							type: "dynamic",
							roundness: 0.5,
							forceDirection: 'none'
						},
					},

					nodes: {
						font: {
							face: 'Roboto',
							size: 14,
							// color: 'green'
						},
						// color: {
							// 	border: '#2B7CE9',
							// 	background: '#97C2FC',
							// 	highlight: {
								// 		border: '#2B7CE9',
								// 		background: '#D2E5FF'
								// 	},
								// 	hover: {
									// 		border: '#2B7CE9',
									// 		background: '#D2E5FF'
									// 	}
									// },
									// scaling: {
										// 		min: 10,
										// 		max: 20,
										// 		label: {
											// 				enabled: false,
											// 				min: 10,
											// 				max: 30,
											// 				maxVisible: 30,
											// 				drawThreshold: 5
											// 			},
											// 		},
											shape: 'box',
											// size: 10, //only for 'dot', 'square' etc
											// value: 10
										},
									}
									);

			this.layoutVisualisation(startNodeUri, isTaxonomy);
			this.focusAndScale(startNodeUri);

			this.setNavigationButtonTooltips();

		}

	setNavigationButtonTooltips(): void{
		let visup = document.getElementsByClassName('vis-up')[0];
		let visdown = document.getElementsByClassName('vis-down')[0];
		let visleft = document.getElementsByClassName('vis-left')[0];
		let visright = document.getElementsByClassName('vis-right')[0];

		let visZoomFull = document.getElementsByClassName('vis-zoomExtends')[0];
		let visZoomIn = document.getElementsByClassName('vis-zoomIn')[0];
		let visZoomOut = document.getElementsByClassName('vis-zoomOut')[0];

		visup.setAttribute('title', 'move up');
		visdown.setAttribute('title', 'move down');
		visleft.setAttribute('title', 'move left');
		visright.setAttribute('title', 'move right');
		visZoomFull.setAttribute('title', 'center view');
		visZoomIn.setAttribute('title', 'zoom in');
		visZoomOut.setAttribute('title', 'zoom out');

	}

		focusAndScale(uri: string): void{
			this.network.selectNodes([uri], true);

			// this.network.moveTo({
			// 	position: this.network.getPositions(uri),
			// 	scale: 0.1,
			// 	offset: { x: 0, y: 0 },
			// 	animation: {
			// 		duration: 1000,
			// 		easingFunction: "easeInOutQuad"
			// 	}
			// });

			// this.network.focus(uri, {
			// 	scale: 0.01,
			// 	locked: false,
			// });

			this.nodes.update([{
				id: uri,
				color: {
					border: '#7C9B79',
					background: '#C2F78C',
					highlight: {
						border: '#7C9B79',
						background: '#CCFF8F'
					},
					hover: {
						border: '#7C2B79',
						background: '#CCFF8F'
					}
				},
			}]);
		}

	layoutVisualisation(uri: string, isTaxonomy: boolean): void {
		if (isTaxonomy) {
				this.network.setOptions({
					physics: {
						enabled: false,
						hierarchicalRepulsion: {
							nodeDistance: 100,
							springConstant: 0.05
						}
					},
					layout: { 
						hierarchical: {
							enabled: true,
							direction: 'DU',
							sortMethod: 'directed',
							levelSeparation: 100,
							blockShifting: true,
							edgeMinimization: true,
							parentCentralization: true,
						} 
					} 
				});
			} else {
				// this.network.setOptions({
				// 	physics: {
				// 		enabled: true,
				// 		solver: 'repulsion',
				// 		repulsion: {
				// 			nodeDistance: 150
				// 		},
				// 		// barnesHut: {
				// 		// 	avoidOverlap: 0.2,
				// 		// 	gravitationalConstant: -500,
				// 		// 	springLength: 90,
				// 		// },
				// 		// minVelocity: 0.75,
				// 		// timestep: 0.9,

				// 		// stabilization: {
				// 		// 	enabled: true,
				// 		// 	iterations: 1000,
				// 		// 	updateInterval: 25
				// 		// }
				// 	},
				// 	layout: {
				// 		hierarchical: {
				// 			enabled: false,
				// 			direction: 'DU',
				// 			sortMethod: 'directed',
				// 			levelSeparation: 100,
				// 			blockShifting: true,
				// 			edgeMinimization: true,
				// 			parentCentralization: true,
				// 		}
				// 	}
				// });

				this.network.setOptions({
					physics: {
						enabled: false,
						solver: 'repulsion',
						repulsion: {
							nodeDistance: 200
						},
					},
					layout:{
						hierarchical:{
							enabled: true,
							direction: 'DU',
							sortMethod: 'directed',
							levelSeparation: -150,
							nodeSpacing: 200,
							treeSpacing: 200,
							blockShifting: true,
							edgeMinimization: true,
							parentCentralization: true,
						}
					}
				});

			this.network.moveNode(uri, 0, 500);
		}

		//disables fixed nodes for hierarchical layouts
		for (let id of this.nodes.getIds()) {
			this.nodes.update([{
				id: id,
				fixed: {
					x: false,
					y: false
				}
			}]);
		}

		document.getElementById('networkView').classList.add('border');

		}

		autoResize(isTaxonomy: boolean): void{
			document.getElementById('networkView').addEventListener('resize', function() {
			
				let proportion: number = 1;

				if (isTaxonomy) {
					proportion = 2;
				}

				let newWidth: string = document.getElementById('termHierarchyWidget').clientWidth * proportion + 'px'; //window.innerHeight;
				document.getElementById('networkView').style.height = newWidth;
				// document.getElementById('networkView').getElementsByTagName('canvas').item(0).style.height = newWidth;

				});
			}
		}