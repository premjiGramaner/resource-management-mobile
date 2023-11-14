import { TestBed } from '@angular/core/testing';

import { ResourceRequirementService } from './resource-requirement.service';

describe('ResourceRequirementService', () => {
  let service: ResourceRequirementService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ResourceRequirementService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
