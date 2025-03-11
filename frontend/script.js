import { UserView } from "./js/userView.js";
import { UserPresenter } from "./js/userPresenter.js";

$(document).ready(function () {
    const view = new UserView();
    const presenter = new UserPresenter(view);
    view.initializeEvents(presenter);

    presenter.checkSession();
})