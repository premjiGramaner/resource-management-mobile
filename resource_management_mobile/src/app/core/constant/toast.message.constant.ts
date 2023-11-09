import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ToastConstants {
    Invalid_Skill = 'Enter atleast one skill';
    Invalid_Partner = 'Enter atleast one partner';
    Delete_success_message = 'Deleted successfully';
    try_again = 'Please try again';
}