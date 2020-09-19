describe("", () => {
  beforeEach(() => cy.seedAndVisit([]));

  it("Should load the page and accespt input", () => {
    const name = "Buy milk";

    cy.focused().should("have.class", "new-todo");
    cy.get(".new-todo").type(name).should("have.value", name);
  });

  context("Form submission", () => {
    it("Adds a new todo on submit", () => {
      const name = "Buy eggs";
      cy.route("POST", "/api/todos", {
        name,
        id: 1,
        isComplete: false,
      });

      cy.get(".new-todo").type(name).type("{enter}").should("have.value", "");

      cy.get(".todo-list").should("have.length", 1).and("contain", name);
    });

    it("Should show an error on failed submission", () => {
      cy.route({
        url: "/api/todos",
        method: "POST",
        status: 500,
        response: {},
      });

      cy.get(".new-todo").type("test{enter}");
      cy.get(".todo-list li").should("not.exist");
      cy.get(".error").should("be.visible");
    });
  });
});
