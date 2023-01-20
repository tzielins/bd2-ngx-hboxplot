"use strict";
(self["webpackChunkbd2_ngx_hboxplot_demo"] = self["webpackChunkbd2_ngx_hboxplot_demo"] || []).push([["main"],{

/***/ 78237:
/*!*****************************************************************!*\
  !*** ./projects/bd2-ngx-hboxplot-demo/src/app/app.component.ts ***!
  \*****************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "AppComponent": () => (/* binding */ AppComponent)
/* harmony export */ });
/* harmony import */ var rxjs__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! rxjs */ 28653);
/* harmony import */ var rxjs_operators__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! rxjs/operators */ 59295);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ 22560);
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @angular/common */ 94666);
/* harmony import */ var bd2_ngx_hboxplot__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! bd2-ngx-hboxplot */ 84011);





function AppComponent_li_40_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](0, "li");
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const row_r1 = ctx.$implicit;
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtextInterpolate1"]("[", row_r1, "],");
  }
}
class AppComponent {
  constructor() {
    this.title = 'Vertical Box Plot';
    this.data = [];
    this.removed = [];
    this.isHidden = false;
    this.labelsOn = 'always';
    this.sorted = 'median';
    this.ci = 0;
    this.testData = [[20, 21, 23, 24, 25], [18, 18.5, 25.5, 25, 26, 22.8, 25.8, 26, 25.1, 26.8], [30], [20, 20.5, 20.6], [28, 29.7, 28.5], [21.5, 29.7, 28.4, 29.5, 24, 24.1, 25.9, 24.7, 23.7, 24.3, 23.4, 24.5, 22.5, 23.7, 23.9, 23.5], []];
    const nr = Math.random() * 15 + 1;
    const row = [];
    for (let i = 0; i < nr; i++) {
      row.push(Math.random() * 10 + 20);
    }
    this.testData.push(row);
    // this.generateData();
    this.generateData();
  }
  toggleRemoved() {
    if (this.removed.length === 0) {
      this.removed = [0, 3];
    } else {
      this.removed = [];
    }
  }
  toggleHidden() {
    this.isHidden = !this.isHidden;
  }
  toggleSorted() {
    if (this.sorted === 'median') {
      this.sorted = 'label';
    } else if (this.sorted === 'label') {
      this.sorted = 'none';
    } else {
      this.sorted = 'median';
    }
  }
  toggleLabels() {
    if (this.labelsOn === 'always') {
      this.labelsOn = 'trigger';
    } else if (this.labelsOn === 'trigger') {
      this.labelsOn = null;
    } else {
      this.labelsOn = 'always';
    }
  }
  // for testing fast changing data
  generateDelayedData() {
    let s;
    s = (0,rxjs__WEBPACK_IMPORTED_MODULE_1__.interval)(1000).pipe((0,rxjs_operators__WEBPACK_IMPORTED_MODULE_2__.take)(3)).subscribe(v => this.generateDataInner(4), err => {}, () => {
      if (s) {
        s.unsubscribe();
      }
    });
  }
  generateData() {
    // this.generateDataInner(2);
    this.generateDelayedData();
  }
  generateDataInner(nrBase = 1) {
    this.ci++;
    //
    const nr = nrBase + Math.random() * 15; // (1 + * 15)
    // console.log("TD: " + this.testData.length);
    const d = [];
    for (let i = 0; i < nr; i++) {
      // let ix = i % this.testData.length;
      const ix = Math.round(Math.random() * (this.testData.length - 1));
      // console.log("I " + ix);
      let row = this.testData[ix];
      const base = -3 + Math.random() * 8;
      row = row.map(v => v + base);
      /*if (ix === 1) {
       if (Math.random() < 0.5) {
       row[0] = row[row.length - 1];
       }
       }*/
      d.push(row);
    }
    const LET = 'ABCDEFGHIJKLMN abcdef';
    const labels = d.map((v, ix) => {
      const s = Math.random() * 30 + 3;
      let label = ''; //
      for (let i = 0; i < s; i++) {
        label += LET[Math.round(Math.random() * (LET.length - 1))];
      }
      label += ' ' + (ix + 1) + '. ';
      return label;
    });
    this.data = d;
    this.labels = labels;
  }
  detection() {
    this.ci++;
    console.log('Change detection ' + this.ci);
    return 'Change detection';
  }
}
AppComponent.ɵfac = function AppComponent_Factory(t) {
  return new (t || AppComponent)();
};
AppComponent.ɵcmp = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdefineComponent"]({
  type: AppComponent,
  selectors: [["app-root"]],
  decls: 41,
  vars: 14,
  consts: [[1, "container", "central-area"], [1, "row"], [1, "col-md-12"], [1, "col-sm-3"], [1, "form-group"], [1, "btn", "btn-primary", "btn-sm", 3, "click"], [3, "click"], [1, "col-sm-9"], [3, "hidden"], [3, "data", "labels", "hidden", "labelsOn", "removed", "sorted"], [1, "col-sm-12"], [1, "list-unstyled", 2, "margin", "1em"], [4, "ngFor", "ngForOf"]],
  template: function AppComponent_Template(rf, ctx) {
    if (rf & 1) {
      _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](0, "div", 0)(1, "div", 1)(2, "div", 2)(3, "h1");
      _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](4);
      _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
      _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](5, "div")(6, "p");
      _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](7, " Simple demo of horizontal box plot. V 1.11.0 ");
      _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
      _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](8, "p");
      _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](9, "Generated triggers generation of multiple data sets to illustrate changes.");
      _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]()();
      _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](10, "hr");
      _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]()();
      _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](11, "div", 1)(12, "div", 3)(13, "div", 4)(14, "label", 5);
      _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵlistener"]("click", function AppComponent_Template_label_click_14_listener() {
        return ctx.toggleRemoved();
      });
      _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](15, "Toggle removed:");
      _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
      _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](16, "a", 6);
      _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵlistener"]("click", function AppComponent_Template_a_click_16_listener() {
        return ctx.toggleRemoved();
      });
      _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](17);
      _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]()();
      _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](18, "div", 4)(19, "a", 5);
      _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵlistener"]("click", function AppComponent_Template_a_click_19_listener() {
        return ctx.generateData();
      });
      _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](20, "generate");
      _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]()();
      _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](21, "div", 4)(22, "label", 5);
      _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵlistener"]("click", function AppComponent_Template_label_click_22_listener() {
        return ctx.toggleHidden();
      });
      _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](23);
      _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
      _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](24, "br");
      _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](25, "label", 5);
      _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵlistener"]("click", function AppComponent_Template_label_click_25_listener() {
        return ctx.toggleLabels();
      });
      _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](26);
      _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
      _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](27, "br");
      _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](28, "label", 5);
      _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵlistener"]("click", function AppComponent_Template_label_click_28_listener() {
        return ctx.toggleSorted();
      });
      _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](29);
      _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
      _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](30, "br");
      _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]()();
      _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](31, "div", 7)(32, "div", 8);
      _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](33, "bd2-ngx-hbox-plot", 9);
      _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
      _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](34);
      _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
      _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](35, "div", 10)(36, "div", 4)(37, "label");
      _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](38, "Data:");
      _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
      _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](39, "ul", 11);
      _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtemplate"](40, AppComponent_li_40_Template, 2, 1, "li", 12);
      _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]()()()()();
    }
    if (rf & 2) {
      _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](4);
      _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtextInterpolate1"](" ", ctx.title, " ");
      _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](13);
      _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtextInterpolate1"](" [", ctx.removed, "]");
      _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](6);
      _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtextInterpolate1"]("Toggle Hidden: ", ctx.isHidden, "");
      _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](3);
      _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtextInterpolate1"]("Toggle Labels: ", ctx.labelsOn, "");
      _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](3);
      _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtextInterpolate1"]("Toggle Sorted: ", ctx.sorted, "");
      _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](3);
      _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("hidden", ctx.isHidden);
      _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](1);
      _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("data", ctx.data)("labels", ctx.labels)("hidden", ctx.isHidden)("labelsOn", ctx.labelsOn)("removed", ctx.removed)("sorted", ctx.sorted);
      _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](1);
      _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtextInterpolate1"](" ", ctx.detection(), " ");
      _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](6);
      _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("ngForOf", ctx.data);
    }
  },
  dependencies: [_angular_common__WEBPACK_IMPORTED_MODULE_3__.NgForOf, bd2_ngx_hboxplot__WEBPACK_IMPORTED_MODULE_4__.HBoxPlotComponent],
  styles: ["\n/*# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IiIsInNvdXJjZVJvb3QiOiIifQ== */"]
});

/***/ }),

/***/ 15907:
/*!**************************************************************!*\
  !*** ./projects/bd2-ngx-hboxplot-demo/src/app/app.module.ts ***!
  \**************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "AppModule": () => (/* binding */ AppModule)
/* harmony export */ });
/* harmony import */ var _angular_platform_browser__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/platform-browser */ 34497);
/* harmony import */ var _app_component__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./app.component */ 78237);
/* harmony import */ var bd2_ngx_hboxplot__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! bd2-ngx-hboxplot */ 84011);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ 22560);




class AppModule {}
AppModule.ɵfac = function AppModule_Factory(t) {
  return new (t || AppModule)();
};
AppModule.ɵmod = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵdefineNgModule"]({
  type: AppModule,
  bootstrap: [_app_component__WEBPACK_IMPORTED_MODULE_0__.AppComponent]
});
AppModule.ɵinj = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵdefineInjector"]({
  imports: [_angular_platform_browser__WEBPACK_IMPORTED_MODULE_2__.BrowserModule, bd2_ngx_hboxplot__WEBPACK_IMPORTED_MODULE_3__.BD2NgxHBoxplotModule]
});
(function () {
  (typeof ngJitMode === "undefined" || ngJitMode) && _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵsetNgModuleScope"](AppModule, {
    declarations: [_app_component__WEBPACK_IMPORTED_MODULE_0__.AppComponent],
    imports: [_angular_platform_browser__WEBPACK_IMPORTED_MODULE_2__.BrowserModule, bd2_ngx_hboxplot__WEBPACK_IMPORTED_MODULE_3__.BD2NgxHBoxplotModule]
  });
})();

/***/ }),

/***/ 30825:
/*!************************************************************************!*\
  !*** ./projects/bd2-ngx-hboxplot-demo/src/environments/environment.ts ***!
  \************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "environment": () => (/* binding */ environment)
/* harmony export */ });
// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.
const environment = {
  production: false
};
/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.

/***/ }),

/***/ 91305:
/*!****************************************************!*\
  !*** ./projects/bd2-ngx-hboxplot-demo/src/main.ts ***!
  \****************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _angular_platform_browser__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @angular/platform-browser */ 34497);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/core */ 22560);
/* harmony import */ var _app_app_module__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./app/app.module */ 15907);
/* harmony import */ var _environments_environment__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./environments/environment */ 30825);




if (_environments_environment__WEBPACK_IMPORTED_MODULE_1__.environment.production) {
  (0,_angular_core__WEBPACK_IMPORTED_MODULE_2__.enableProdMode)();
}
_angular_platform_browser__WEBPACK_IMPORTED_MODULE_3__.platformBrowser().bootstrapModule(_app_app_module__WEBPACK_IMPORTED_MODULE_0__.AppModule).catch(err => console.error(err));

/***/ }),

/***/ 84011:
/*!*************************************************************!*\
  !*** ./dist/bd2-ngx-hboxplot/fesm2020/bd2-ngx-hboxplot.mjs ***!
  \*************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "BD2NgxHBoxplotModule": () => (/* binding */ BD2NgxHBoxplotModule),
/* harmony export */   "HBoxPlotComponent": () => (/* binding */ HBoxPlotComponent)
/* harmony export */ });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ 22560);
/* harmony import */ var d3__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! d3 */ 17659);



const d3 = d3__WEBPACK_IMPORTED_MODULE_0__;
/**
 D3 integration was originally based on the code for npm library: d3-ng2-service
 by Tom Wanzek, https://github.com/tomwanzek/d3-ng2-service.

 That package was used during developement and then converted into inline service
 to reduce the dependencies and boundle size.

 At some point, I moved to to simpler dependency on d3:
 npm install --save d3
 npm install --save-dev @types/d3

 and removed the parts from d3-modules.ts as they were causing errors
 (not sure how to fix them and also one dependency is easier to maintain).
 */

/*
// that has been removed after importing a single d3 dependency

export {
  // d3-array
  Bin,
  Bisector,
  HistogramGenerator,
  Numeric,
  ThresholdArrayGenerator,
  ThresholdCountGenerator,
  // d3-axis
  Axis,
  AxisContainerElement,
  AxisScale,
  AxisTimeInterval,
  // d3-scale
  InterpolatorFactory,
  ScaleBand,
  ScaleIdentity,
  ScaleLinear,
  ScaleLogarithmic,
  ScaleOrdinal,
  ScalePoint,
  ScalePower,
  ScaleQuantile,
  ScaleQuantize,
  ScaleSequential,
  ScaleThreshold,
  ScaleTime,

  // d3-selection
  ArrayLike,
  BaseEvent,
  BaseType,
  ContainerElement,
  EnterElement,
  Local,
  NamespaceLocalObject,
  NamespaceMap,
  Selection,
  SelectionFn,
  TransitionLike,
  ValueFn,
  // d3-selection-multi
  ValueMap,
  // d3-shape
  Arc,
  Area,
  DefaultArcObject,
  Line,
  Pie,
  PieArcDatum,
  RadialArea,
  RadialLine,
  Series,
  SeriesPoint,
  Stack,
  Symbol,
  SymbolType,
  // d3-transition
  Transition
} from './d3-modules';


 */

class LookAndFeel {
  constructor() {
    this.vMargin = 25;
    this.hMarginL = 20;
    this.hMarginR = 15;
    this.rowWidth = 30;
    this.rowGap = 0.2;
    this.transitionTime = 600;
    this.boxStrokeWidth = '2px';
    this.boxFillOpacity = 0.35;
    this.meanStrokeWidth = '4px';
    this.labelFont = '12px';
    this.labelFillOpacity = 0.35;
    this.backLabelOpacity = 0.30;
    this.backdropColor = 'white';
    this.backdropOpacity = 1;
    this.whiskerStrokeWidth = '1px';
    this.outliersStrokeWidth = '1px';
    this.outliersCircleRadius = 3;
    this.outliersFillOpacity = 0.4;
  }
}
let defualtLookAndFeel = function () {
  return new LookAndFeel();
};
class GraphicContext {
  constructor() {
    /*transitionTime: number;
             get transitionOn(): boolean {
     return (this.transitionTime && this.transitionTime > 0);
     };*/
    this.labelsTimers = [];
  }
}
function offsetScaleValue(x, pixOffset, scale) {
  const r = scale.range();
  const pos = scale(x) + pixOffset;
  if (pos < r[0]) {
    return r[0];
  } else if (pos > r[1]) {
    return r[1];
  }
  return pos;
}
class BoxDefinition {
  constructor() {
    this.outliers = [];
  }
}
class BoxUtil {
  dataToBoxes(data) {
    if (!data) {
      return [];
    }
    return data.map((v, ix) => {
      const b = this.datumToBox(v);
      b.ix = ix;
      b.key = ix + 1 + '.';
      return b;
    });
  }
  datumToBox(data) {
    const box = new BoxDefinition();
    if (!data || data.length === 0) {
      return box;
    }
    data = data.sort(d3.ascending);
    box.mean = d3.mean(data);
    box.median = d3.median(data);
    box.fstQnt = d3.quantile(data, 0.25);
    box.thrdQnt = d3.quantile(data, 0.75);
    const iqr = 1.5 * (box.thrdQnt - box.fstQnt);
    box.lowWskr = box.fstQnt - iqr;
    box.highWskr = box.thrdQnt + iqr;
    for (let i = 0; i < data.length; i++) {
      if (data[i] >= box.lowWskr) {
        box.lowWskr = data[i];
        break;
      }
    }
    for (let i = data.length - 1; i >= 0; i--) {
      if (data[i] <= box.highWskr) {
        box.highWskr = data[i];
        break;
      }
    }
    box.outliers = data.filter(v => v < box.lowWskr || v > box.highWskr);
    return box;
  }
  mockEmptyValues(boxes, missingVal) {
    boxes.forEach(box => {
      if (box.mean === undefined || box.mean === null) {
        box.mean = missingVal;
        box.median = missingVal;
        box.fstQnt = missingVal;
        box.thrdQnt = missingVal;
        box.lowWskr = missingVal;
        box.highWskr = missingVal;
      }
    });
  }
}
class BD2ColorPalette {
  static extendPalette(palette, size) {
    if (!palette || palette.length === 0) {
      palette = ['black'];
    }
    const out = [];
    for (let i = 0; i < size; i++) {
      out.push(palette[i % palette.length]);
    }
    return out;
  }
  static palette(size) {
    // if (true) return BD2ColorPalette.extendPalette(['#1f77b4'], size);
    if (size <= BD2ColorPalette.schemeCategory10.length) {
      return BD2ColorPalette.extendPalette(BD2ColorPalette.schemeCategory10, size);
    } else {
      return BD2ColorPalette.extendPalette(BD2ColorPalette.schemeCategory20, size);
    }
  }
}
BD2ColorPalette.schemeCategory10 = ['#1f77b4', '#ff7f0e', '#2ca02c', '#d62728', '#9467bd', '#8c564b', '#e377c2', '#7f7f7f', '#bcbd22', '#17becf'];
BD2ColorPalette.schemeCategory20 = ['#1f77b4', '#aec7e8', '#ff7f0e', '#ffbb78', '#2ca02c', '#98df8a', '#d62728', '#ff9896', '#9467bd', '#c5b0d5', '#8c564b', '#c49c94', '#e377c2', '#f7b6d2', '#7f7f7f', '#c7c7c7', '#bcbd22', '#dbdb8d', '#17becf', '#9edae5'];
class SmartRounder {
  static round(value, base) {
    base = base || value;
    base = Math.abs(base);
    if (base < 0.01) {
      return value;
    }
    if (base < 1) {
      return Math.round(value * 10000) / 10000;
    }
    if (base < 1000) {
      return Math.round(value * 100) / 100;
    }
    return Math.round(value);
  }
}
class HBoxPlotComponent {
  set sorted(sorting) {
    if (sorting === 'median') {
      this.sortFunction = (b1, b2) => b1.median - b2.median;
    } else if (sorting === 'label') {
      // console.log("N",navigator.language);
      /*if (navigator.language) {
       this.sortFunction = (b1: BoxDefinition, b2: BoxDefinition) =>
       b1.label.localeCompare(b2.label, navigator.language, {sensitivity: 'case'});
       } else {
       this.sortFunction = (b1: BoxDefinition, b2: BoxDefinition) => b1.label.localeCompare(b2.label);
       };*/
      this.sortFunction = (b1, b2) => {
        if (b1.label === b2.label) {
          return 0;
        }
        if (b1.label < b2.label) {
          return -1;
        }
        return 1;
      };
    } else {
      this.sortFunction = (b1, b2) => b1.ix - b2.ix;
    }
  }
  constructor(ngZone, changeDetectorRef, element) {
    this.ngZone = ngZone;
    this.changeDetectorRef = changeDetectorRef;
    /**
     * Necessary to control hiding of the element, otherwise the BBoxes are not defined and labels
     * were not rendered in correct places.
     *
     */
    this.hidden = false;
    this.removed = [];
    this.domain = [17, 36];
    this.palette = [];
    this.labels = [];
    this.labelsOn = 'always'; // trigger //null
    this.lookAndFeel = defualtLookAndFeel();
    this.sortChanged = false;
    this.colors = new _angular_core__WEBPACK_IMPORTED_MODULE_1__.EventEmitter();
    this.graphicContext = new GraphicContext();
    this.boxUtil = new BoxUtil();
    this.sortFunction = function (b1, b2) {
      return b1.ix - b2.ix;
    };
    this.d3 = d3;
    this.parentNativeElement = element.nativeElement;
  }
  /**
   * It is detached from angular to prevent unnecessary change detection
   */
  ngAfterViewInit() {
    this.changeDetectorRef.detach();
    // console.log("AFI");
  }
  /**
   * Explicit triggers re-drawing as need to have all the parameters set (so will not redrawn if data came frist and domain later)
   * @param changes
   */
  ngOnChanges(changes) {
    // console.log("Changes", changes);
    // otherwise the hidden on inner div was not updated
    this.changeDetectorRef.detectChanges();
    this.initSVG();
    // this.handleHiding();
    if (!this.data) {
      return;
    }
    this.sortChanged = changes.sorted !== undefined;
    if (!this.hidden) {
      this.updatePlot();
    }
  }
  isDataUpdate(changes) {
    return changes.data || changes.removed || changes.domain || changes.palette || changes.labels;
  }
  initSVG() {
    if (!this.d3Svg) {
      const d3ParentElement = this.d3.select(this.parentNativeElement);
      this.d3Svg = d3ParentElement.select('.hbox-plot').append('svg');
      this.d3Svg.attr('width', '0');
    }
  }
  ngOnInit() {
    if (this.parentNativeElement !== null) {} else {
      console.error('Missing parrent element for the component');
    }
  }
  ngOnDestroy() {
    if (this.d3Svg && this.d3Svg.empty && !this.d3Svg.empty()) {
      this.d3Svg.selectAll('*').remove();
    }
  }
  /**
   * Only for testing
   * @param context
   */
  testGraphicContext(context) {
    this.graphicContext = context;
  }
  /* Not needed any more, the hidding is achieved by simple div hidden attribute
   // and the problem with labels background rendering is solved using delayed rendering with a timer.
   handleHiding() {
   if (this.hidden) {
   this.removed = this.d3Svg.remove();
   } else {
   if (this.removed) {
   this.d3.select(this.parentNativeElement)
   .select('.hbox-plot')
   .append(() => this.d3Svg.node());
   this.removed = undefined;
   }
   }
       }*/
  updatePlot() {
    // this.graphicContext.transitionTime = this.lookAndFeel.transitionTime;
    if (this.lookAndFeel.transitionTime > 0) {
      this.graphicContext.transitionOn = true;
      this.ngZone.runOutsideAngular(() => {
        this.graphicContext.transition = this.d3.transition().duration(this.lookAndFeel.transitionTime);
      });
    } else {
      this.graphicContext.transitionOn = false;
      this.graphicContext.transition = undefined;
    }
    this.graphicContext = this.updatePalette(this.data, this.palette, this.graphicContext);
    let boxes = this.prepareDataModel(this.data, this.removed, this.labels, this.graphicContext.palette, this.domain, this.sortFunction);
    boxes = boxes.filter(b => !b.hidden);
    this.graphicContext = this.preparePane(boxes, this.lookAndFeel, this.graphicContext);
    this.graphicContext = this.prepareScales(boxes, this.domain, this.lookAndFeel, this.graphicContext);
    this.graphicContext = this.plotAxisBox(boxes, this.domain, this.lookAndFeel, this.mainPane, this.graphicContext);
    this.graphicContext = this.plotDataBoxes(boxes, this.lookAndFeel, this.mainPane, this.graphicContext);
    this.graphicContext = this.prepareTooltip(this.mainPane, this.graphicContext);
    this.graphicContext = this.prepareLabels(boxes, this.mainPane, this.lookAndFeel, this.graphicContext, this.labelsOn);
  }
  prepareDataModel(data, removed, labels, palette, domain, sortFunction) {
    let boxes = this.boxUtil.dataToBoxes(data);
    this.boxUtil.mockEmptyValues(boxes, domain[1]);
    this.labelBoxes(boxes, labels);
    this.colorBoxes(boxes, palette);
    removed.forEach(ix => {
      if (boxes[ix]) {
        boxes[ix].hidden = true;
      }
    });
    boxes = boxes.sort(sortFunction);
    return boxes;
  }
  updatePalette(data, palette, graphicContext) {
    if (!palette || palette.length === 0) {
      graphicContext.palette = BD2ColorPalette.palette(data.length);
    } else {
      graphicContext.palette = BD2ColorPalette.extendPalette(palette, data.length);
    }
    this.colors.next(graphicContext.palette.slice());
    return graphicContext;
  }
  colorBoxes(boxes, palette) {
    boxes.forEach(b => b.color = palette[b.ix]);
  }
  preparePane(data, lookAndFeel, graphicContext) {
    // console.log("PP",data);
    if (!this.mainPane) {
      // let d3ParentElement = this.d3.select(this.parentNativeElement);
      // this.d3Svg = d3ParentElement.select('.hbox-plot').append<SVGSVGElement>('svg');
      this.d3Svg.attr('width', '100%');
      this.mainPane = this.d3Svg.append('g');
      this.mainPane.classed('mainPane', true);
    }
    const pWidth = 500;
    const pHeight = this.calculateWorkspaceHeight(data, lookAndFeel) + 2 * lookAndFeel.vMargin;
    const elm = graphicContext.transitionOn ? this.d3Svg.transition(graphicContext.transition) : this.d3Svg;
    elm.attr('viewBox', '0 0 ' + pWidth + ' ' + pHeight);
    this.mainPane.attr('transform', 'translate(' + lookAndFeel.hMarginL + ',' + lookAndFeel.vMargin + ')');
    // .attr('transform', 'translate(' + (pWidth / 2) + ',' + (pHeight / 2) + ')'); //moves 0,0 of the pain to the middle of the graphics
    graphicContext.workspaceWidth = pWidth - lookAndFeel.hMarginL - lookAndFeel.hMarginR;
    graphicContext.workspaceHeight = pHeight - 2 * lookAndFeel.vMargin;
    return graphicContext;
  }
  calculateWorkspaceHeight(data, lookAndFeel) {
    return lookAndFeel.rowWidth * data.length;
  }
  labelBoxes(boxes, labels) {
    if (!labels) {
      labels = [];
    }
    boxes.forEach((b, ix) => {
      b.label = labels[ix] ? labels[ix] : '' + (ix + 1);
    });
  }
  prepareLabels(boxes, mainPane, lookAndFeel, graphicContext, labelsOn) {
    if (!graphicContext.labelsWrapper) {
      graphicContext.labelsWrapper = mainPane.append('g').classed('labelsWrapper', true);
    }
    if (!graphicContext.backLabelsWrapper) {
      graphicContext.backLabelsWrapper = mainPane.insert('g', 'g.dataWrapper').classed('backLabelsWrapper', true);
    }
    const backLabelsOn = labelsOn === 'always';
    const mainLabelsOn = labelsOn === 'always' || labelsOn === 'trigger';
    const labels = graphicContext.labelsWrapper.selectAll('g.yLabel').data(mainLabelsOn ? boxes : [], d => d.key);
    labels.exit().remove();
    const newLabels = labels.enter().append('g').classed('yLabel', true);
    this.ngZone.runOutsideAngular(() => {
      newLabels.on('mouseover', function (evnt, d) {
        d3.select(this).selectAll('.yLabel')
        // .style("visibility", "visible");
        .style('display', null);
      }).on('mouseout', function () {
        d3.select(this).selectAll('.yLabel')
        // .style("visibility", "hidden");
        .style('display', 'none');
      });
    });
    newLabels.append('rect').attr('class', 'yTrigger').style('fill-opacity', 1);
    newLabels.append('rect').attr('class', 'yLabel').style('fill-opacity', 0.35)
    // .style("visibility", "hidden");
    .style('display', 'none');
    newLabels.append('text').attr('class', 'yLabel').attr('text-anchor', 'left').attr('dominant-baseline', 'central').style('font-size', lookAndFeel.labelFont).style('opacity', 1).attr('x', 5);
    const backLabels = graphicContext.backLabelsWrapper.selectAll('g.yLabel').data(backLabelsOn ? boxes : [], d => d.key);
    backLabels.exit().remove();
    const newBackLabels = backLabels.enter().append('g').classed('yLabel', true);
    /*
     newBackLabels.append<SVGGElement>("rect")
     .attr("class", "yLabel")
     .style("fill-opacity", 0.05);
     */
    newBackLabels.append('text').attr('class', 'yLabel').attr('text-anchor', 'left').attr('dominant-baseline', 'central').style('font-size', lookAndFeel.labelFont).style('opacity', lookAndFeel.backLabelOpacity).attr('x', 5);
    // .style("visibility", "hidden");
    const enterUpdate = newLabels.merge(labels);
    const backEnterUpdate = newBackLabels.merge(backLabels);
    // called with delay to allow, parent divs to component sets their visibility, otherwise the bboxes cannot be calculated
    // and the labels backgrounds and trigers are not rendered correctly
    // it is a hack, but don't know how to do it correctly
    // timers have to be cleared as otherwise saw errors in logs for fast changing input data (like cause by sorting and pagination)
    graphicContext.labelsTimers.forEach(timer => clearTimeout(timer));
    graphicContext.labelsTimers = [];
    const timer = setTimeout(() => {
      const bboxes = [];
      enterUpdate.select('text').style('display', null).attr('y', d => graphicContext.yScale(d.key) + graphicContext.yScale.bandwidth() / 2).text(d => d.label).each(function (d) {
        bboxes.push(this.getBBox());
        // console.log("D: " + d.label, this.getBBox());
      }).style('display', 'none');
      let elm = backEnterUpdate.select('text');
      elm = graphicContext.transitionOn ? elm.transition(graphicContext.transition) : elm;
      elm.attr('y', d => graphicContext.yScale(d.key) + graphicContext.yScale.bandwidth() / 2).text(d => d.label);
      const trigers = enterUpdate.select('.yTrigger').style('fill', d => d.color).style('stroke', d => d.color);
      let telm = trigers.data(bboxes);
      telm = graphicContext.transitionOn ? telm.transition(graphicContext.transition) : telm;
      telm.attr('x', -7).attr('y', b => b.y - 3).attr('width', b => 7).attr('height', b => b.height + 6);
      const frames = enterUpdate.select('rect.yLabel').style('fill', d => d.color).style('fill-opacity', lookAndFeel.labelFillOpacity);
      frames.data(bboxes).attr('x', 0).attr('y', b => b.y - 3).attr('width', b => b.width + 10).attr('height', b => b.height + 7);
      /*
       let backFrames = backEnterUpdate.select<SVGSVGElement>("rect.yLabel")
       .style("fill", d => d.color);
               backFrames.data(bboxes)
       .attr("x", 0)
       .attr("y", b => b.y - 3)
       .attr("width", b => b.width + 10)
       .attr("height", b => b.height + 7);
       */
    }, 10);
    graphicContext.labelsTimers.push(timer);
    return graphicContext;
  }
  prepareTooltip(mainPane, graphicContext) {
    if (graphicContext.tooltipWrapper) {
      return graphicContext;
    }
    graphicContext.tooltipWrapper = mainPane.append('g').classed('tooltipWrapper', true);
    graphicContext.tooltipBox = graphicContext.tooltipWrapper.append('rect').style('fill', 'white').style('fill-opacity', 0.8).style('stroke', 'grey');
    graphicContext.tooltipText = graphicContext.tooltipWrapper.append('text').attr('class', 'tooltip')
    // .attr("text-anchor", "left")
    .attr('text-anchor', 'middle')
    // .attr("alignment-baseline", "middle")
    // .attr("alignment-baseline", "baseline")
    // .attr("dy", "-10px")
    .style('opacity', 1);
    graphicContext.tooltipWrapper
    // .style("visibility", "hidden");
    .style('display', 'none');
    return graphicContext;
  }
  showTooltip(v, x, y) {
    // console.log("Show: " + v + ";" + this.constructor.name);
    // console.log('Show: ' + v + '; ' + x + ': ' + y);
    // console.log('v', SmartRounder.round(v));
    // console.log('x', this.graphicContext.xScale(x));
    // console.log('y', this.graphicContext.yScale(y));
    if (!this.graphicContext.tooltipText) {
      return;
    }
    this.graphicContext.tooltipText.attr('x', this.graphicContext.xScale(x)).attr('y', this.graphicContext.yScale(y)).text(SmartRounder.round(v));
    // I have to change the display here even before the box is ready as
    // in firefox the getBBox was not working if called with display none
    // giving NS_ERROR_FAILURE 2147500037
    this.graphicContext.tooltipWrapper
    // .style("visibility", "visible");
    .style('display', null);
    const bbox = this.graphicContext.tooltipText.node().getBBox();
    this.graphicContext.tooltipBox.attr('x', bbox.x - 3).attr('y', bbox.y - 2).attr('width', bbox.width + 6).attr('height', bbox.height + 4);
  }
  hideTooltip() {
    // console.log("Hide: ");
    if (!this.graphicContext.tooltipText) {
      return;
    }
    this.graphicContext.tooltipWrapper
    // .style("visibility", "hidden");
    .style('display', 'none');
    // this.graphicContext.tooltipText
    // .transition().duration(this.lookAndFeel.baseTransitionsTime / 2)
    // .style("opacity", 0);
  }

  prepareScales(data, domain, lookAndFeel, graphicContext) {
    if (!graphicContext.xScale) {
      graphicContext.xScale = d3.scaleLinear().clamp(true);
    }
    graphicContext.xScale.domain(domain).range([0, graphicContext.workspaceWidth]);
    if (!graphicContext.yScale) {
      graphicContext.yScale = d3.scaleBand().padding(lookAndFeel.rowGap);
    }
    const domainY = data.map(d => d.key);
    graphicContext.yScale.domain(domainY).range([0, graphicContext.workspaceHeight]);
    return graphicContext;
  }
  plotAxisBox(data, domain, lookAndFeel, mainPane, graphicContext) {
    if (!graphicContext.axisWrapper) {
      graphicContext.axisWrapper = this.initAxisWrapper(mainPane);
    }
    graphicContext = this.plotHorizontalScales(domain, lookAndFeel, graphicContext);
    graphicContext = this.plotVerticalScales(data, lookAndFeel, graphicContext);
    return graphicContext;
  }
  initAxisWrapper(mainPane) {
    let wrapper = mainPane.select('.axisWrapper');
    if (wrapper.size() === 0) {
      wrapper = mainPane.append('g').attr('class', 'axisWrapper');
      wrapper.append('g').attr('class', 'xTopAxis');
      wrapper.append('g').attr('class', 'xBottomAxis');
      wrapper.append('g').attr('class', 'yLeftAxis');
      wrapper.append('g').attr('class', 'yRightAxis');
    }
    return wrapper;
  }
  plotHorizontalScales(domain, lookAndFeel, graphicContext) {
    if (!graphicContext.xTopAxis) {
      graphicContext.xTopAxis = d3.axisTop(graphicContext.xScale);
    }
    if (!graphicContext.xBottomAxis) {
      graphicContext.xBottomAxis = d3.axisBottom(graphicContext.xScale);
    }
    let elmT = graphicContext.axisWrapper.select('g.xTopAxis');
    elmT.call(graphicContext.xTopAxis);
    let elmB = graphicContext.axisWrapper.select('g.xBottomAxis');
    elmB = graphicContext.transitionOn ? elmB.transition(graphicContext.transition) : elmB;
    elmB.attr('transform', 'translate(0,' + graphicContext.workspaceHeight + ')').call(graphicContext.xBottomAxis);
    return graphicContext;
  }
  plotVerticalScales(data, lookAndFeel, graphicContext) {
    if (!graphicContext.yLeftAxis) {
      graphicContext.yLeftAxis = d3.axisLeft(graphicContext.yScale).tickFormat(() => '');
    }
    if (!graphicContext.yRightAxis) {
      graphicContext.yRightAxis = d3.axisRight(graphicContext.yScale).tickValues([]);
    }
    let elm = graphicContext.axisWrapper.select('g.yLeftAxis');
    elm = graphicContext.transitionOn ? elm.transition(graphicContext.transition) : elm;
    elm.call(graphicContext.yLeftAxis);
    elm = graphicContext.axisWrapper.select('g.yRightAxis').attr('transform', 'translate(' + graphicContext.workspaceWidth + ',0)');
    elm = graphicContext.transitionOn ? elm.transition(graphicContext.transition) : elm;
    elm.call(graphicContext.yRightAxis);
    return graphicContext;
  }
  plotDataBoxes(boxes, lookAndFeel, mainPane, graphicContext) {
    if (!graphicContext.dataWrapper) {
      graphicContext.dataWrapper = mainPane.append('g').attr('class', 'dataWrapper');
    }
    let boxWidgets = graphicContext.dataWrapper.selectAll('.boxWidget');
    boxWidgets = boxWidgets.data(boxes, d => d.key);
    this.updateBoxWidgets(boxWidgets, lookAndFeel, graphicContext);
    const newBoxWidgets = boxWidgets.enter().append('g').attr('class', 'boxWidget');
    this.createBoxWidgets(newBoxWidgets, lookAndFeel, graphicContext);
    boxWidgets.exit().remove();
    return graphicContext;
  }
  updateBoxWidgets(boxWidgets, lookAndFeel, graphicContext) {
    // this.ngZone.runOutsideAngular(() => {
    boxWidgets.select('rect.backdrop').call(this.positionBackdrop, graphicContext);
    this.updateWhiskers(boxWidgets.select('g.whiskers'), graphicContext);
    boxWidgets.select('g.box rect').call(this.positionBoxRectangle, graphicContext);
    boxWidgets.select('g.box line.medianline').call(this.positionMedianLine, graphicContext);
    boxWidgets.select('g.box line.meanline').call(this.positionMeanLine, graphicContext);
    const out = boxWidgets.select('g.outliers').selectAll('.outlier').data(d => d.outliers.map(x => [x, d.key, d.color]));
    out.enter().call(this.createOutlier, lookAndFeel, graphicContext, this.positionOutlier);
    out.call(this.positionOutlier, graphicContext);
    out.exit().remove();
    // });
  }

  positionBackdrop(elm, graphicContext) {
    elm = graphicContext.transitionOn ? elm.transition(graphicContext.transition) : elm;
    elm.attr('x', d => offsetScaleValue(d.lowWskr, -5, graphicContext.xScale)).attr('y', d => {
      return graphicContext.yScale(d.key);
    }).attr('width', d => {
      const x1 = offsetScaleValue(d.lowWskr, -5, graphicContext.xScale);
      const x2 = offsetScaleValue(d.highWskr, +5, graphicContext.xScale);
      return x2 - x1;
    }).attr('height', d => {
      return graphicContext.yScale.bandwidth();
    });
  }
  positionBoxRectangle(elm, graphicContext) {
    elm = graphicContext.transitionOn ? elm.transition(graphicContext.transition) : elm;
    elm.attr('x', d => graphicContext.xScale(d.fstQnt)).attr('y', d => {
      return graphicContext.yScale(d.key);
    }).attr('width', d => graphicContext.xScale(d.thrdQnt) - graphicContext.xScale(d.fstQnt)).attr('height', d => {
      return graphicContext.yScale.bandwidth();
    }).style('stroke', d => d.color).style('fill', d => d.color);
  }
  positionMedianLine(elm, graphicContext) {
    elm = graphicContext.transitionOn ? elm.transition(graphicContext.transition) : elm;
    elm.attr('x1', (d, i) => graphicContext.xScale(d.median)).attr('y1', (d, i) => graphicContext.yScale(d.key)).attr('x2', (d, i) => graphicContext.xScale(d.median)).attr('y2', (d, i) => graphicContext.yScale(d.key) + graphicContext.yScale.bandwidth()).style('stroke', d => d.color)
    // .style("visibility", d => d.mean === d.median ? "hidden" : "visible");
    .style('display', d => d.mean === d.median ? 'none' : null);
  }
  positionMeanLine(elm, graphicContext) {
    elm = graphicContext.transitionOn ? elm.transition(graphicContext.transition) : elm;
    elm.attr('x1', (d, i) => graphicContext.xScale(d.mean)).attr('y1', (d, i) => graphicContext.yScale(d.key)).attr('x2', (d, i) => graphicContext.xScale(d.mean)).attr('y2', (d, i) => graphicContext.yScale(d.key) + graphicContext.yScale.bandwidth()).style('stroke', d => d.color);
  }
  positionOutlier(elm, graphicContext) {
    elm = graphicContext.transitionOn ? elm.transition(graphicContext.transition) : elm;
    elm.attr('cx', d => graphicContext.xScale(d[0])).attr('cy', d => graphicContext.yScale(d[1]) + graphicContext.yScale.bandwidth() / 2).style('stroke', d => d[2]).style('fill', d => d[2]);
  }
  createOutlier(elm, lookAndFeel, graphicContext, positionOutlierFunction) {
    elm.append('circle').attr('class', 'outlier').attr('r', lookAndFeel.outliersCircleRadius).style('stroke-width', lookAndFeel.outliersStrokeWidth).style('fill-opacity', lookAndFeel.outliersFillOpacity).call(positionOutlierFunction, graphicContext);
  }
  positionWhiskerLine(elm, left, graphicContext) {
    elm = graphicContext.transitionOn ? elm.transition(graphicContext.transition) : elm;
    elm.attr('x1', (d, i) => left ? graphicContext.xScale(d.lowWskr) : graphicContext.xScale(d.thrdQnt)).attr('y1', (d, i) => graphicContext.yScale(d.key) + graphicContext.yScale.bandwidth() / 2).attr('x2', (d, i) => left ? graphicContext.xScale(d.fstQnt) : graphicContext.xScale(d.highWskr)).attr('y2', (d, i) => graphicContext.yScale(d.key) + graphicContext.yScale.bandwidth() / 2).style('stroke', d => d.color)
    // .style("visibility", d => (left && (d.lowWskr === d.fstQnt)) || (!left && (d.highWskr === d.thrdQnt)) ? "hidden" : "visible");
    .style('display', d => left && d.lowWskr === d.fstQnt || !left && d.highWskr === d.thrdQnt ? 'none' : null);
  }
  positionWhiskerTip(elm, left, graphicContext) {
    elm = graphicContext.transitionOn ? elm.transition(graphicContext.transition) : elm;
    elm.attr('x1', (d, i) => left ? graphicContext.xScale(d.lowWskr) : graphicContext.xScale(d.highWskr)).attr('y1', (d, i) => graphicContext.yScale(d.key)).attr('x2', (d, i) => left ? graphicContext.xScale(d.lowWskr) : graphicContext.xScale(d.highWskr)).attr('y2', (d, i) => graphicContext.yScale(d.key) + graphicContext.yScale.bandwidth()).style('stroke', d => d.color)
    // .style("visibility", d => (left && (d.lowWskr === d.fstQnt)) || (!left && (d.highWskr === d.thrdQnt)) ? "hidden" : "visible");
    .style('display', d => left && d.lowWskr === d.fstQnt || !left && d.highWskr === d.thrdQnt ? 'none' : null);
  }
  updateWhiskers(whiskers, graphicContext) {
    whiskers.select('line.whiskerlineL').call(this.positionWhiskerLine, true, graphicContext);
    whiskers.select('line.whiskerlineR').call(this.positionWhiskerLine, false, graphicContext);
    whiskers.select('line.whiskertipL').call(this.positionWhiskerTip, true, graphicContext);
    whiskers.select('line.whiskertipR').call(this.positionWhiskerTip, false, graphicContext);
  }
  createWhiskers(whiskers, lookAndFeel, graphicContext) {
    const lwhiskr = whiskers.append('line').attr('class', 'whiskerlineL').style('stroke-width', lookAndFeel.whiskerStrokeWidth).style('stroke-dasharray', '4 3').call(this.positionWhiskerLine, true, graphicContext);
    const rwhiskr = whiskers.append('line').attr('class', 'whiskerlineR').style('stroke-width', lookAndFeel.whiskerStrokeWidth).style('stroke-dasharray', '4 3').call(this.positionWhiskerLine, false, graphicContext);
    const lTip = whiskers.append('line').attr('class', 'whiskertipL').style('stroke-width', lookAndFeel.whiskerStrokeWidth).call(this.positionWhiskerTip, true, graphicContext);
    const rTip = whiskers.append('line').attr('class', 'whiskertipR').style('stroke-width', lookAndFeel.whiskerStrokeWidth).call(this.positionWhiskerTip, false, graphicContext);
  }
  createBoxes(widgets, lookAndFeel, graphicContext) {
    const rect = widgets.append('rect').attr('class', 'box').style('stroke-width', lookAndFeel.boxStrokeWidth).style('fill-opacity', lookAndFeel.boxFillOpacity).call(this.positionBoxRectangle, graphicContext);
    const median = widgets.append('line').attr('class', 'medianline').style('stroke-width', lookAndFeel.boxStrokeWidth).call(this.positionMedianLine, graphicContext);
    const instance = this;
    this.ngZone.runOutsideAngular(() => {
      rect.on('mouseover', function (evnt, d) {
        instance.showTooltip(d.median, d.median, d.key);
      }).on('mouseout', function () {
        instance.hideTooltip();
      });
      median.on('mouseover', function (evnt, d) {
        instance.showTooltip(d.median, d.median, d.key);
      }).on('mouseout', function () {
        instance.hideTooltip();
      });
    });
    const mean = widgets.append('line').attr('class', 'meanline').style('stroke-width', lookAndFeel.meanStrokeWidth).style('stroke-dasharray', '4 2').call(this.positionMeanLine, graphicContext);
    // has to be outside angular, to prevent detection
    this.ngZone.runOutsideAngular(() => {
      mean.on('mouseover', function (evnt, d) {
        instance.showTooltip(d.mean, d.mean, d.key);
      }).on('mouseout', function () {
        instance.hideTooltip();
      });
    });
  }
  createBoxWidgets(newBoxWidgets, lookAndFeel, graphicContext) {
    // this.ngZone.runOutsideAngular(() => {
    const instance = this;
    const backdrops = newBoxWidgets.append('rect').attr('class', 'backdrop')
    // .style("stroke-width", lookAndFeel.boxStrokeWidth)
    .style('fill-opacity', lookAndFeel.backdropOpacity).style('fill', lookAndFeel.backdropColor).call(this.positionBackdrop, graphicContext);
    const whiskers = newBoxWidgets.append('g').attr('class', 'whiskers');
    this.createWhiskers(whiskers, lookAndFeel, graphicContext);
    const boxes = newBoxWidgets.append('g').attr('class', 'box');
    this.createBoxes(boxes, lookAndFeel, graphicContext);
    const outliers = newBoxWidgets.append('g').attr('class', 'outliers');
    outliers.selectAll('.outlier').data(d => d.outliers.map(x => [x, d.key, d.color])).enter().call(this.createOutlier, lookAndFeel, graphicContext, this.positionOutlier);
    // });
  }
}

HBoxPlotComponent.ɵfac = function HBoxPlotComponent_Factory(t) {
  return new (t || HBoxPlotComponent)(_angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵdirectiveInject"](_angular_core__WEBPACK_IMPORTED_MODULE_1__.NgZone), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵdirectiveInject"](_angular_core__WEBPACK_IMPORTED_MODULE_1__.ChangeDetectorRef), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵdirectiveInject"](_angular_core__WEBPACK_IMPORTED_MODULE_1__.ElementRef));
};
HBoxPlotComponent.ɵcmp = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵdefineComponent"]({
  type: HBoxPlotComponent,
  selectors: [["bd2-ngx-hbox-plot"]],
  inputs: {
    hidden: "hidden",
    data: "data",
    removed: "removed",
    domain: "domain",
    palette: "palette",
    labels: "labels",
    labelsOn: "labelsOn",
    lookAndFeel: "lookAndFeel",
    sorted: "sorted"
  },
  outputs: {
    colors: "colors"
  },
  features: [_angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵNgOnChangesFeature"]],
  decls: 1,
  vars: 1,
  consts: [[1, "hbox-plot", 3, "hidden"]],
  template: function HBoxPlotComponent_Template(rf, ctx) {
    if (rf & 1) {
      _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelement"](0, "div", 0);
    }
    if (rf & 2) {
      _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵproperty"]("hidden", ctx.hidden);
    }
  },
  styles: ["[_nghost-%COMP%]     .axisWrapper path{stroke:gray}[_nghost-%COMP%]     .axisWrapper line{stroke:gray}[_nghost-%COMP%]     .axisWrapper text{fill:gray}"],
  changeDetection: 0
});
(function () {
  (typeof ngDevMode === "undefined" || ngDevMode) && _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵsetClassMetadata"](HBoxPlotComponent, [{
    type: _angular_core__WEBPACK_IMPORTED_MODULE_1__.Component,
    args: [{
      selector: 'bd2-ngx-hbox-plot',
      changeDetection: _angular_core__WEBPACK_IMPORTED_MODULE_1__.ChangeDetectionStrategy.OnPush,
      template: `
    <div class="hbox-plot" [hidden]="hidden"></div>
  `,
      styles: [":host ::ng-deep .axisWrapper path{stroke:gray}:host ::ng-deep .axisWrapper line{stroke:gray}:host ::ng-deep .axisWrapper text{fill:gray}\n"]
    }]
  }], function () {
    return [{
      type: _angular_core__WEBPACK_IMPORTED_MODULE_1__.NgZone
    }, {
      type: _angular_core__WEBPACK_IMPORTED_MODULE_1__.ChangeDetectorRef
    }, {
      type: _angular_core__WEBPACK_IMPORTED_MODULE_1__.ElementRef
    }];
  }, {
    hidden: [{
      type: _angular_core__WEBPACK_IMPORTED_MODULE_1__.Input
    }],
    data: [{
      type: _angular_core__WEBPACK_IMPORTED_MODULE_1__.Input
    }],
    removed: [{
      type: _angular_core__WEBPACK_IMPORTED_MODULE_1__.Input
    }],
    domain: [{
      type: _angular_core__WEBPACK_IMPORTED_MODULE_1__.Input
    }],
    palette: [{
      type: _angular_core__WEBPACK_IMPORTED_MODULE_1__.Input
    }],
    labels: [{
      type: _angular_core__WEBPACK_IMPORTED_MODULE_1__.Input
    }],
    labelsOn: [{
      type: _angular_core__WEBPACK_IMPORTED_MODULE_1__.Input
    }],
    lookAndFeel: [{
      type: _angular_core__WEBPACK_IMPORTED_MODULE_1__.Input
    }],
    sorted: [{
      type: _angular_core__WEBPACK_IMPORTED_MODULE_1__.Input
    }],
    colors: [{
      type: _angular_core__WEBPACK_IMPORTED_MODULE_1__.Output
    }]
  });
})();
class BD2NgxHBoxplotModule {}
BD2NgxHBoxplotModule.ɵfac = function BD2NgxHBoxplotModule_Factory(t) {
  return new (t || BD2NgxHBoxplotModule)();
};
BD2NgxHBoxplotModule.ɵmod = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵdefineNgModule"]({
  type: BD2NgxHBoxplotModule
});
BD2NgxHBoxplotModule.ɵinj = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵdefineInjector"]({});
(function () {
  (typeof ngDevMode === "undefined" || ngDevMode) && _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵsetClassMetadata"](BD2NgxHBoxplotModule, [{
    type: _angular_core__WEBPACK_IMPORTED_MODULE_1__.NgModule,
    args: [{
      declarations: [HBoxPlotComponent],
      imports: [],
      exports: [HBoxPlotComponent]
    }]
  }], null, null);
})();
(function () {
  (typeof ngJitMode === "undefined" || ngJitMode) && _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵsetNgModuleScope"](BD2NgxHBoxplotModule, {
    declarations: [HBoxPlotComponent],
    exports: [HBoxPlotComponent]
  });
})();

/*
 * Public API Surface of bd2-ngx-hboxplot
 */

/**
 * Generated bundle index. Do not edit.
 */



/***/ })

},
/******/ __webpack_require__ => { // webpackRuntimeModules
/******/ var __webpack_exec__ = (moduleId) => (__webpack_require__(__webpack_require__.s = moduleId))
/******/ __webpack_require__.O(0, ["vendor"], () => (__webpack_exec__(91305)));
/******/ var __webpack_exports__ = __webpack_require__.O();
/******/ }
]);
//# sourceMappingURL=main.js.map