import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ToastConstants {
    Invalid_Skill = 'Enter atleast one skill';
    Invalid_Partner = 'Enter atleast one partner';
    Delete_success_message = 'Deleted successfully';
    try_again = 'Please try again';
    invalid_requirement_ID = 'Please select the requirement';
    all_required_field = 'Please ender all required fields';
    resource_record_not_found = 'Resource Record Not Found';
    timeout = 'Session timeout';
    tokenError = 'JsonWebTokenError';
    tokenExpired = 'TokenExpiredError';
    invalidUser = 'Invalid User';
    partner_dropdown_placeholder = 'Select Support Mode';
    partner_supportModeDropdown_title = 'supportMode';
    client_dropdown_placeholder = 'Ownership Name';
    client_supportModeDropdown_title = 'Ownership';
    requirement_Dropdown_title = 'Requirement';
    requirement_placeholder = 'Requirement';
    evaluated_Dropdown_title = 'Evaluated By';
    evaluated_dropdown_placeholder = 'Evaluated By';
    resource_card_placeholder = 'Select Resource';
    resource_card_stage_placeholder = 'Select Stage';
    resource_card_status_placeholder = 'Select Status';
    location_error_message = `Location can't delete! Due to dependency exists !!`;
    hiring_stage_placeholder = 'Select Hiring Stage';
    hiring_status_placeholder = 'Select Hiring Status';
    status_placeholder = 'Select Status';
    select_source_placeholder = 'Select source';
    select_type_placeholder = 'Select Type';
    select_partner_placeholder = 'Select partner';
    select_location_placeholder = 'Select Preferred Location';
    work_select_location_placeholder = 'Select Work Location';
    current_select_location_placeholder = 'Select Current Location';
    Client_placeholder = 'Select Client';
    location_placeholder = 'Select Location';
    SPOC_placeholder = 'Select SPOC';
    priority_placeholder = 'Select Priority';
    select_skill = 'Select Skill';
    select_rating = 'Select Rating'
}
