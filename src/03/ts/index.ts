'use strict';

type calc = 'division' | 'multiple' | 'subtract' | 'add';
type sign = '÷' | '×' | '-' | '+' | '';

export class Calculator {
  resultEl: HTMLElement;
  calcSignEl: HTMLElement;
  calcNumEl: HTMLElement;
  btnItemsEl: HTMLElement;
  calcTypes: Object;
  startCalcType: calc;
  currentCalcType: calc;
  maxDigits: number;
  resultInput: Boolean;
  constructor() {
    this.resultEl = document.querySelector('.calculator-result__num');
    this.calcNumEl = document.querySelector('.calculator-calc__num');
    this.calcSignEl = document.querySelector('.calculator-calc__sign');
    this.btnItemsEl = document.querySelector('.calculator-btn');
    this.calcTypes = {
      division: {id: 'division', text: '÷'},
      multiple: {id: 'multiple', text: '×'},
      subtract: {id: 'subtract', text: '-'},
      add: {id: 'add', text: '+'},
    };
    this.startCalcType = 'add';
    this.currentCalcType = this.startCalcType;
    this.maxDigits = 10;
    this.resultInput = true;
  }

  init() {
    this.changeResultView(0);
    this.changeCalcView(0);
    this.changeSignView('');
  }

  /**
   * 結果の描画
   * @param num 表示する数字
   */
  changeResultView(num: number): void {
    this.resultEl.textContent = num + '';
  }

  /**
   * 計算結果の取得
   * @returns 計算結果文字列
   */
  getCalcResult(): string {
    const currentResult = Number(this.resultEl.textContent);
    const currentCalcNum = Number(this.calcNumEl.textContent);
    let result;
    switch (this.currentCalcType) {
      case 'division':
        result = currentResult / currentCalcNum;
        break;
      case 'multiple':
        result = currentResult * currentCalcNum;
        break;
      case 'subtract':
        result = currentResult - currentCalcNum;
        break;
      case 'add':
        result = currentResult + currentCalcNum;
        break;
      default:
        break;
    }
    if ((result + '').length > this.maxDigits) {
      // 計算結果の桁数がmaxDigits以上の場合はerrorを表示
      return 'error';
    } else {
      return result + '';
    }
  }

  /**
   * 結果エリアへの入力結果を取得
   * @param num 入力された数値
   */
  getInputResult(num: string) {
    let newNum;
    const currentResult = this.resultEl.textContent;
    if (
      (currentResult === '0' && num !== '.') ||
      currentResult === 'error'
    ) {
      // TODO: 多分error出ている状態で小数点入れるとエラー。要修正
      // 結果エリアがの文字が0で小数点以外が入力された、または結果エリアにerrorが表示されている場合
      newNum = num;
    } else if (
      currentResult.indexOf('.') !== -1 &&
      num === '.'
    ) {
      // 結果エリアに少数点がない状態で、小数点が入力された場合
    } else {
      //
    }
  }

  /**
   * 結果エリアへの削除結果を取得
   * @param num 削除する文字数
   * @returns result 結果の文字列
   */
  getDeleteResult(num: number): string {
    if (this.resultEl.textContent.length > 1) {
      // 結果エリアに一文字以上入力されている場合
      // TODO: 多分numがlength以上の時にエラー。要修正
      return this.resultEl.textContent.slice(0, -1 * num);
    } else {
      // 結果エリアに一文字入力されている場合
      return '0';
    }
  }

  /**
   * 桁数のチェック結果を取得
   * @returns 最大桁数を超えているかの真偽
   */
  digitsCheck(): Boolean {
    return this.resultEl.textContent.length > this.maxDigits;
  }

  /**
   * 計算の描画
   * @param num 表示する数字
   */
  changeCalcView(num: number): void {
    this.calcNumEl.textContent = num + '';
  }

  /**
   * 記号の描画
   * @param sign 表示する記号
   */
  changeSignView(sign: sign): void {
    this.calcSignEl.textContent = sign;
  }

  /**
   * 計算タイプの変更
   * @param type 計算タイプ
   */
  changeCalcType(type: calc): void {
    this.currentCalcType = type;
    this.changeSignView(this.calcTypes[type].text);
  }

  /**
   * 計算タイプのクリア
   */
  clearCalcType(): void {
    this.currentCalcType = this.startCalcType;
    this.resultInput = true;
    this.changeSignView('');
  }

  /**
   * ボタンクリック時のイベント設定
   */
  clickBtnHandler(): void {
    this.btnItemsEl.addEventListener('click', e => {
      // 結果がエラーの場合は結果の値を0にする
      if(this.resultEl.textContent === 'error') {
        this.resultEl.textContent = '0';
        return;
      }

      const targetEl = <HTMLElement>e.target;
      const targetClass = targetEl.classList;
      if (targetClass.contains('calculator-btn__num')) {
        // 数字の場合
        const num = targetEl.dataset['num'];
        if (this.digitsCheck()) return;
        if (this.resultInput) {
          const newNum = this.getInputResult(num);
          this.changeResultView(Number(newNum));
        } else {
          // const newNum = state.calcIns.changeNum(num);
          // calcView.changeCalcNum(newNum);
        }
      }
    });
  }
}
