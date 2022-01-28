export default class Modal {
  constructor(parentEl) {
    this.parentEl = parentEl;
  }

  static get markup() {
    return `
        <div class="modal modal-active">
            <form class="modal-form-box">
		        	<div class="modal-content">
			          <h3 class="description__title"></h3>
                <div class="input-wrapper">
                  <label for="lfname">Выберите псевдоним</label> 
                  <input class="input-tooltip input__username" type="text" placeholder="Меня зовут..."/>
                  <span class="tooltip-active hidden"></span>
                </div>
                <div class="button__block form__button">
                	<button class="modal-send__btn">Ok!</button>
							  </div>
				      </div>
            </form>
        </div>
`;
  }

  redrawModalForm() {
    this.parentEl.insertAdjacentHTML("afterbegin", this.constructor.markup);
    this.modalWrapperEl.classList.add("modal-active");
    /* this.modalButtonEl.addEventListener("click", (e) => {
      e.preventDefault();
      this.closeModalForm();
  }); */
  }

  get modalWrapperEl() {
    return this.parentEl.querySelector(".modal");
  }

  get modalButtonEl() {
    return this.parentEl.querySelector(".modal-send__btn");
  }

  validityFields(field) {
    // проверка соответствия шаблону, добавление подсказки

    const templateTooltip = document.createElement("span");

    templateTooltip.classList.add("tooltip-active");

    if (
      field.parentElement.nextElementSibling.classList.contains(
        "tooltip-active"
      )
    ) {
      return;
    }

    if (field.value === "") {
      field.parentElement.insertAdjacentElement("afterend", templateTooltip);
      templateTooltip.textContent = "*Заполните поле";
      return false;
    }

    return true;
  }

  closeModalForm() {
    this.modalWrapperEl.classList.remove("modal-active");
    this.parentEl.querySelector(".modal").remove();
  }
}
