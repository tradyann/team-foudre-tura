import { NgModule, Optional, SkipSelf } from '@angular/core';
import { CommonModule } from '@angular/common';

@NgModule({
declarations: [
],
imports: [
    CommonModule
],
exports: [
],
providers: [
    //AuthService
    // {
    //     provide: HTTP_INTERCEPTORS,
    //     useClass: MyInterceptor,
    //     multi: true
    // }
],
})
export class CoreModule {
constructor(@Optional() @SkipSelf() parentModule: CoreModule) {
    if (parentModule) {
        throw new Error('CoreModule is already loaded.');
        }
    }
}
