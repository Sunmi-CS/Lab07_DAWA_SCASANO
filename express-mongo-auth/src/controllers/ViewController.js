class ViewController {
    signIn(req, res) { res.render('signIn'); }
    signUp(req, res) { res.render('signUp'); }
    profile(req, res) { res.render('profile'); }
    dashboardUser(req, res) { res.render('dashboardUser'); }
    dashboardAdmin(req, res) { res.render('dashboardAdmin'); }
    page403(req, res) { res.status(403).render('403'); }
    page404(req, res) { res.status(404).render('404'); }
}
export default new ViewController();