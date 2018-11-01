import { TestBed } from '@angular/core/testing';

import { BatteryLevelService } from './battery-level.service';

describe('BatteryLevelService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: BatteryLevelService = TestBed.get(BatteryLevelService);
    expect(service).toBeTruthy();
  });
});
