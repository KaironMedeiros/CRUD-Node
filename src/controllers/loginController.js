const { async } = require('regenerator-runtime')
const Login = require('../models/LoginModel')

exports.index = (req, res) => {
    if (req.session.user) return res.render('login-logado')
    return res.render('login')
}

//----------------------metodo para cadastro-------------------------
exports.register = async (req, res) => {
    try {
        const login = new Login(req.body)
        await login.register()

        if (login.errors.length > 0) {
            req.flash('errors', login.errors)
            req.session.save(function () {
                return res.redirect('/login/index')
            })
            return
        }


        req.flash('success', 'Seu usuario foi criado com sucesso')
        req.session.save(function () {
            return res.redirect('/login/index')
        })


    } catch (e) {
        console.log(e)
        return res.render('404')
    }
}

//----------------------metodo para logar-------------------------
exports.login = async (req, res) => {
    try {
        const login = new Login(req.body)
        await login.login()

        if (login.errors.length > 0) {
            req.flash('errors', login.errors)
            req.session.save(function () {
                return res.redirect('/login/index')
            })
            return
        }

        req.flash('success', 'Voçe entrou no sistema')
        req.session.user = login.user
        req.session.save(function () {
            return res.redirect('/login/index')
        })


    } catch (e) {
        console.log(e)
        return res.render('404')
    }
}

//----------------------metodo para sair do sistema-------------------------
exports.logout = function (req, res) {
    req.session.destroy()
    res.redirect('/')
}



