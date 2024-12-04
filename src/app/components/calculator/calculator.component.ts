import { Component, OnInit, HostListener } from '@angular/core'

@Component({
  selector: 'app-calculator',
  templateUrl: './calculator.component.html',
  styleUrls: ['./calculator.component.scss']
})

export class CalculatorComponent implements OnInit {
  buttonVals = ['1', '2', '3', '/', '4', '5', '6', 'X', '7', '8', '9', '-', '(', ')', '0', '+', 'Del', '.', '=', '%', 'AC']

  operands = ['X', '/', '+', '%', '-', '=']
  parentheses = ['(', ')']
  actionBtns = ['Del', 'AC']
  allowedAtStart = [...Array(10)].map((_, i) => i.toString())

  inputVals = ''
  prevOperand = ''
  curOperand = ''
  prevParenthhesis = ''
  curParenthesis = ''
  prevValue = ''
  curValue = ''
  isPrevValueOperand = false
  isOperandOrValueAllowed = false

  @HostListener('document:keyup', ['$event']) onGettingKeyBoardInputs($event: KeyboardEvent) {
    let pressedKey = $event.key
    this.onCheckOperandOrValueAllowed(pressedKey)

    const keyMap: Record<string, string> = {
      'Enter': '=',
      ' ': '=',
      'Delete': 'Del',
      'Backspace': 'Del',
      'x': 'X',
      '*': 'X'
    }

    pressedKey = keyMap[pressedKey] ?? pressedKey

    this.isOperandOrValueAllowed && this.buttonVals.indexOf(pressedKey) !== -1 && this.onCheckingCalcLogic(pressedKey)
  }

  constructor() { }

  ngOnInit(): void {
    this.allowedAtStart = [...this.allowedAtStart, '-', '+', '(', ')']
  }

  getInput(e:any, val: string) {
    this.onCheckOperandOrValueAllowed(val)

    if (this.isOperandOrValueAllowed)
      this.onCheckingCalcLogic(val)
  }
  

  onCheckingCalcLogic(pressedKey: string) {
    if (this.operands.indexOf(pressedKey) !== -1) {
      pressedKey === 'X' ? this.curOperand = '*' : this.curOperand = pressedKey
      if (pressedKey === '=')
        this.computeTheExp()
      else {
        this.operandLogic()
        this.isPrevValueOperand = true
      }
      
    }
    else if (this.parentheses.indexOf(pressedKey) !== -1) {
        this.curParenthesis = pressedKey
        this.parenthesesLogic()
        this.isPrevValueOperand = false
    }
    else if (this.actionBtns.indexOf(pressedKey) !== -1) {
        this.actionLogic(pressedKey)
        this.isPrevValueOperand = false
    }
    else {
        this.curValue = pressedKey
        this.valueLogic()
        this.isPrevValueOperand = false
    }
  }

  operandLogic() {
    if (this.prevOperand == this.curOperand)
      return
    else if (this.isPrevValueOperand && this.allowedAtStart.indexOf(this.curOperand) !== -1)
      this.actionLogic('Del')
    else if (this.isPrevValueOperand && this.inputVals.length == 1)
      return
    else if (this.isPrevValueOperand)
      this.actionLogic('Del')

    this.inputVals += this.curOperand
    this.prevOperand = this.curOperand
    this.prevParenthhesis = ''
    this.prevValue = ''
  }

  parenthesesLogic() {
    if (this.curParenthesis == this.prevParenthhesis)
      return

    this.inputVals += this.curParenthesis
    this.prevParenthhesis = this.curParenthesis
    this.prevOperand = ''
    this.prevValue = ''
  }

  valueLogic() {
    if(this.prevValue === this.curValue && this.prevValue === '.')
      return
    
    this.inputVals += this.curValue
    this.prevValue = this.curValue
    this.prevOperand = this.prevParenthhesis = ''
  }

  computeTheExp() {
    if (this.prevValue === '.')
      this.inputVals += 0
    
    this.inputVals = eval(this.inputVals).toString()
    this.prevOperand = ''
    this.prevParenthhesis = ''
    this.isPrevValueOperand = false
    this.prevValue = this.inputVals
  }

  actionLogic(actionIn: string) {
    if (actionIn == 'Del')
      this.inputVals = this.inputVals.slice(0, -1)
    
    else {
      this.inputVals = ''
      this.prevOperand = ''
      this.prevParenthhesis = ''
      this.prevValue = ''
    }
  }

  onCheckOperandOrValueAllowed(pressedKey: string) {
    if (this.inputVals.length > 0) {
      this.isOperandOrValueAllowed = true
      return
    }
    else if (this.allowedAtStart.indexOf(pressedKey) !== -1) {
      this.isOperandOrValueAllowed = true
      return
    }

    this.isOperandOrValueAllowed = false
  }
}