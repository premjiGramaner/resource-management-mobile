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
    source_mode = [...this.type, "Both", "Freelancing"];
    priority=["High", "Medium", "Low"];
    
    partner_source_mode = [...this.type, "Both"];

    hiring_stage = ["Screening", "R1 Interview", "L1 Interview", "HR Interview", "Management Interview"];
    hiring_status = ["Shortilisted", "On Hold", "Awaiting Feedback", "Rejected"];



    requirement_report_header = ["Name", "Client", "SPOC", "Experience","Location", "Source", "Priority", "Hire Budget", "Contract Budget", "Notice Period", "Duration", "JD", "Status", "Created By", "Updated By"];

}

