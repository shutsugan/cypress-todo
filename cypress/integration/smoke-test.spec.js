describe("Smoke test", () => {
  beforeEach(() => {
    cy.request("GET", "/api/todos")
      .its("body")
      .each((todo) => cy.request("DELETE", `/api/todos/${todo.id}`));
  });

  context("With no todos", () => {
    const todos = [
      { test: "Buy milk", expectedLength: 1 },
      { test: "Buy eggs", expectedLength: 2 },
      { test: "Buy bread", expectedLength: 3 },
    ];

    it("Saves new todos", () => {
      cy.visit("/");
      cy.server();
      cy.route("POST", "/api/todos").as("create");

      cy.wrap(todos).each(({ test, expectedLength }) => {
        cy.focused().type(test).type("{enter}");
        cy.wait("@create");

        cy.get(".todo-list li").should("have.length", expectedLength);
      });
    });
  });

  context("With active todos", () => {
    beforeEach(() => {
      cy.fixture("todos").each((todo) => {
        const newTodo = Cypress._.merge(todo, { isComlete: false });
        cy.request("POST", "/api/todos", newTodo);
      });

      cy.visit("/");
    });

    it("Load existing data from databaes", () => {
      cy.get(".todo-list li").should("have.length", 4);
    });

    it("Delete todos", () => {
      cy.server();
      cy.route("DELETE", "/api/todos/*").as("delete");

      cy.get(".todo-list li")
        .each(($el) => {
          cy.wrap($el).find(".destroy").invoke("show").click();

          cy.wait("@delete");
        })
        .should("not.exist");
    });

    it.only("Toggle todos", () => {
      const clickAndWait = ($el) => {
        cy.wrap($el).as("item").find(".toggle").click();

        cy.wait("@update");
      };

      cy.server();
      cy.route("PUT", "/api/todos/*").as("update");

      cy.get(".todo-list li")
        .each(($el) => {
          clickAndWait($el);

          cy.get("@item").should("have.class", "completed");
        })
        .each(($el) => {
          clickAndWait($el);

          cy.get("@item").should("not.have.class", "completed");
        });
    });
  });
});
