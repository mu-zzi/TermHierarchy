import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { HttpModule } from '@angular/http';
import { FormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { HierarchyComponent } from './hierarchy.component';
import { HierarchyService } from './hierarchy.service';

// import { routing, appRoutes } from './app.routing'

// import { ResultListComponent } from './result-list.component';
// import { ResultComponent } from './result.component';

import { Router, ActivatedRoute } from '@angular/router';

import { APP_CONFIG, AppConfig } from './app.config';

@NgModule({
	imports: [
		BrowserModule,
		HttpModule,
		CommonModule,
		FormsModule,
	],

	declarations: [
		AppComponent,
		HierarchyComponent,
		// ResultComponent,
		// ResultListComponent
	],

	providers: [
		HierarchyService,
		{ provide: APP_CONFIG, useValue: AppConfig },
		// Router
	],

	bootstrap: [
		AppComponent
	]
})
export class AppModule { }
