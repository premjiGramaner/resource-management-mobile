import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class StaticDataConstants {
    source = ["Naukri", "Partner", "Vendor"];
    type = ["Hire", "Contract"];
    yesNo = ["Yes", "No"];
    rating = [
        { name: 'Experienced', id: 5 },
        { name: 'Effective', id: 4 },
        { name: 'Intermediate', id: 3 },
        { name: 'Capable', id: 2 },
        { name: 'Beginner', id: 1 }
    ];
    source_mode = ["Hire", "Contract", "Both", "Freelancing"];
    priority=["High", "Medium", "Low"];
    
    partner_source_mode = [...this.type, "Both"]
}
