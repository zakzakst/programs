// @ts-nocheck

/**
 * 要素の設定
 */
 const base = {
  // elements: {
  //   result: ,
  //   calcSign: ,
  //   calcNum: ,
  //   btnItems: ,
  // },
  // calcTypes: {
  //   division: {id: 'division', text: '÷'},
  //   multiple: {id: 'multiple', text: '×'},
  //   subtract: {id: 'subtract', text: '-'},
  //   add: {id: 'add', text: '+'},
  // },
  // startCalcType: 'add',
  // maxDigits: ,
};


/**
 * 状態の設定
 */
const state = {
  // calcType: base.startCalcType,
  // resultInput: true,
};


/**
 * MODEL
 */
class ResultModel {
  calcResult() {
    this.currentResult = Number(base.elements.result.textContent);
    this.calcNum = Number(base.elements.calcNum.textContent);
    let newNum;
    switch (state.calcType) {
      case 'division':
        newNum = this.currentResult / this.calcNum;
        break;

      case 'multiple':
        newNum = this.currentResult * this.calcNum;
        break;

      case 'subtract':
        newNum = this.currentResult - this.calcNum;
        break;

      case 'add':
        newNum = this.currentResult + this.calcNum;
        break;

      default:
        console.log(error);
        break;
    }
    // 計算結果の桁数がmaxDigits以上の場合はerrorを表示
    if((newNum + '').length > base.maxDigits) {
      return 'error';
    } else {
      return newNum;
    }
  }
  inputResult(num) {
    let newNum;
    const currentResult = base.elements.result.textContent;
    if((currentResult === '0' && num !== '.') || currentResult === 'error') {
      newNum = num;
    } else {
      if(currentResult.indexOf('.') !== -1 && num === '.') {
        return currentResult;
      }
      newNum = currentResult + num;
    }
    return newNum;
  }
  deleteResult(num) {
    let newNum;
    if(base.elements.result.textContent.length > 1) {
      newNum = base.elements.result.textContent.slice(0, -1 * num);
    } else {
      newNum = '0';
    }
    return newNum;
  }
  digitsCheck() {
    const checkResult = base.elements.result.textContent.length > base.maxDigits ? true : false;
    return checkResult;
  }
  errorCheck() {
    const resultText = base.elements.result;
    if(resultText.textContent === 'error') {
      resultText.textContent = '0';
    }
  }
}

class CalcModel {
  constructor() {
    this.numEl = base.elements.calcNum;
  }
  changeNum(num) {
    let newNum = this.numEl.textContent;
    if(newNum === '0' && num !== '.') {
      newNum = num;
    } else {
      if(newNum.indexOf('.') !== -1 && num === '.') {
        return newNum;
      }
      newNum += num;
    }
    return newNum;
  }
  deleteNum(num) {
    let newNum;
    if(this.numEl.textContent.length > 1) {
      newNum = this.numEl.textContent.slice(0, -1 * num);
    } else {
      newNum = '0';
    }
    return newNum;
  }
  digitsCheck() {
    const checkResult = this.numEl.textContent.length > base.maxDigits ? true : false;
    return checkResult;
  }
}


/**
 * VIEW
 */
const commonView = {
  changeText(el, text) {
    el.textContent = text;
  },
}

// const resultView = {
//   el: base.elements.result,
//   init() {
//     commonView.changeText(this.el, 0);
//   },
//   changeResult(num) {
//     commonView.changeText(this.el, num);
//   }
// }

const calcView = {
  // signEl: base.elements.calcSign,
  // numEl: base.elements.calcNum,
  // init() {
  //   commonView.changeText(this.signEl, '');
  //   commonView.changeText(this.numEl, 0);
  // },
  // changeCalcType(calcType) {
  //   state.calcType = calcType;
  //   commonView.changeText(this.signEl, base.calcTypes[calcType].text);
  // },
  // changeCalcNum(num) {
  //   commonView.changeText(this.numEl, num);
  // },
  // clearCalcType() {
  //   state.calcType = base.startCalcType;
  //   state.resultInput = true;
  //   commonView.changeText(this.signEl, '');
  // }
}


/**
 * CONTROLLER
 */
function init() {
  // ■初期化
  // resultView.init();
  // calcView.init();
  // state.calcIns = new CalcModel();
  // state.resultIns = new ResultModel();

  // ■ボタンクリック時のイベント
  base.elements.btnItems.addEventListener('click', e => {
    // 結果がerrorの場合は結果の値を0にする
    state.resultIns.errorCheck();
    if(e.target.classList.contains('calculator-btn__num')) {
      // 数字の場合
      const num = e.target.dataset['num'];
      if(state.resultInput) {
        if(state.resultIns.digitsCheck()) return;
        const newNum = state.resultIns.inputResult(num);
        resultView.changeResult(newNum);
      } else {
        if(state.calcIns.digitsCheck()) return;
        const newNum = state.calcIns.changeNum(num);
        calcView.changeCalcNum(newNum);
      }
    } else if (e.target.classList.contains('calculator-btn__sign')) {
      // 記号の場合
      const calcType = e.target.dataset['calcType'];
      calcView.changeCalcType(calcType);
      state.resultInput = false;
    } else if (e.target.classList.contains('calculator-btn__result')) {
      // 結果の場合
      resultView.changeResult(state.resultIns.calcResult());
      calcView.changeCalcNum(0);
      calcView.clearCalcType();
    } else if (e.target.classList.contains('calculator-btn__delete')) {
      // 削除の場合
      if(state.resultInput) {
        const newNum = state.resultIns.deleteResult(1);
        resultView.changeResult(newNum);
      } else {
        const newNum = state.calcIns.deleteNum(1);
        calcView.changeCalcNum(newNum);
      }
    } else if (e.target.classList.contains('calculator-btn__clear')) {
      // クリアの場合
      calcView.clearCalcType();
      resultView.init();
      calcView.init();
    }
  });
}


/**
 * 実行
 */
init();
