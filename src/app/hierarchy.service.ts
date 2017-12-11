import { Injectable, Inject } from '@angular/core';
import { Http, Response, URLSearchParams } from '@angular/http';
import { Observable } from 'rxjs/Rx';

import { HierarchyResult } from './hierarchy.result';
import { APP_CONFIG, IAppConfig } from './app.config';
import { IS_DEV } from '../main';

@Injectable()
export class HierarchyService{
	private hierarchy: HierarchyResult[] = [];
	private baseUrl: string = IS_DEV ? this.config.DEV_SERVER : this.config.PROD_SERVER;

	constructor(
		private http: Http,
		
		@Inject(APP_CONFIG)
		private config: IAppConfig) { }


	getHierarchy(terminologyId: string, uri: string): Observable<HierarchyResult[]>{
		let params: URLSearchParams = new URLSearchParams();
		params.set(this.config.HIERARCHY_URI, uri);

		return this.http.get(this.baseUrl + terminologyId.toUpperCase() + '/' + this.config.HIERARCHY_SERVICE, { search: params })
			.map(res => res.json())
			.catch(error => Observable.throw(error.json().diagnostics[0]['error'] || 'Unknown server error'));
	}
}