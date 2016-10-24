export default function setValidators(validator) {
  let validators = [{
    name: 'mobile',
    message: '手机号码有误',
    check(value) {
      return value.match(/^1[3-9]\d{9}$/)
    }
  }, {
    name: 'required',
    message: '必填项不能为空',
    check: validator('required')
  }, {
    name: 'email',
    message: '邮箱地址有误',
    check(value) {
      return value.match(/[^@]+@.+/)
    }
  }, {
    name: 'equal',
    message: '两次输入不相等',
    check(value, rule) { //rule 是需要比较的“字段字符串”，例如'user.password'
      return value === this._vm.$get(rule)
    }
  }, {
    name: 'password',
    message: '密码要求6~20位，需要包含字母和数字',
    check(value) {
      return value.match(/^(?=.*\d)(?=.*[A-z]).{6,20}$/)
    }
  }]

  validators.forEach((v) => {
    validator(v.name, {
      message: v.message,
      check: v.check
    })
  })
}
