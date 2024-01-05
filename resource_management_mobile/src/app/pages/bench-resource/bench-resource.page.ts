import { Component, OnInit } from '@angular/core';
import { BenchResourceService } from './service/bench-resource.service';

@Component({
  selector: 'app-bench-resource',
  templateUrl: './bench-resource.page.html',
  styleUrls: ['./bench-resource.page.scss'],
})
export class BenchResourcePage implements OnInit {
  benchData: any[] = [];
  skip: number = 0;
  searchQuery: string = '';
  constructor(private benchResourceService: BenchResourceService) { }

  ngOnInit() {
    this.getBench(this.skip, 20, this.searchQuery);
  }

  getBench(skip: number, limit: number, search: string) {
    this.benchResourceService
      .getBenchData(skip, limit, search)
      .subscribe((data: any) => {
        console.log(data)
        this.benchData = [...this.benchData, ...data.data.resourceInfo];
      });
  }
}
