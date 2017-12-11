import { Component, OnInit } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

@Component({
	selector: 'gfbio-ts-term-hierarchy-widget',
	templateUrl: './app.component.html'
})

export class AppComponent implements OnInit {
	
	ngOnInit(): void{
		console.log('starting the terminology service term hierarchy widget');

		window.addEventListener("resize", function() {
			let elem: Element = document.getElementById('networkView');
			let newHeight: number = elem.clientHeight + 50;
			elem.dispatchEvent(new Event('resize')); //important
			window.parent.postMessage(newHeight + 'px', '*');
		});

		window.dispatchEvent(new Event("resize"));
	}
}
