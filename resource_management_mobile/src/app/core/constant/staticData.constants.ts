import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class StaticDataConstants {
    source = ["Naukri", "Partner", "Vendor"];
    type = ["Hire", "Contract"];
    yesNo = ["Yes", "No"];
    rating: ratingData[] = [
        { name: 'Experienced', id: 5 },
        { name: 'Effective', id: 4 },
        { name: 'Intermediate', id: 3 },
        { name: 'Capable', id: 2 },
        { name: 'Beginner', id: 1 }
    ];
    source_mode = [...this.type, "Both", "Freelancing"];
    priority = ["High", "Medium", "Low"];
    partner_source_mode = [...this.type, "Both"];
    hiring_stage = ["Screening", "R1 Interview", "L1 Interview", "HR Interview", "Management Interview"];
    hiring_status = ["Shortilisted", "On Hold", "Awaiting Feedback", "Rejected"];
    requirement_report_header = ["Name", "Client", "SPOC", "Experience", "Location", "Source", "Priority", "Hire Budget", "Contract Budget", "Notice Period", "Duration", "JD", "Status", "Created By", "Updated By"];
    resource_report_header = ["Name", "Email", "Mobile", "Experience", "Source", "Partner Name", "Type", "Profile Location", "Current Organisation", "Current Org Duration", "CTC", "ECTC",
        "Preferred Location", "Work Location", "Current Location", "Notice Period", "Earliest Joining Date", "Reason for Change", "Created By", "Updated By"];
    hiring_report_header = ["Resource Name", "Evaluated By", "Hiring Status", "Hiring Stage", "Status", "Evaluated Date"];
    dashboard_select_options = [
        { date: '30 Days', id: 1 },
        { date: '6 Months', id: 2 },
        { date: '5 Years', id: 3 }];
}

export interface ratingData {
    name: string,
    id: number
}

