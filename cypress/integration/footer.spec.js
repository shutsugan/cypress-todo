const singleTodo = { id: 1, name: "Buy Milk", isComplete: false };

describe("Footer component", () => {
  context("With a single todo", () => {
    it("Display a single todo in count", () => {
      cy.seedAndVisit([singleTodo]);
      cy.get(".todo-count").should("contain", "1 todo left");
    });
  });

  context("With multi todos", () => {
    beforeEach(() => cy.seedAndVisit());

    it("Display multi todo in count", () => {
      cy.get(".todo-count").should("contain", "todos left");
    });

    it.only("Filter to active todos", () => {
      cy.contains("Active").click();
      cy.get(".todo-list li").should("have.length", 3);
    });

    it("Handle filter links", () => {
      const filters = [
        { link: "All", expectedLength: 4 },
        { link: "Active", expectedLength: 3 },
        { link: "Completed", expectedLength: 1 },
      ];

      cy.wrap(filters).each(({ link, expectedLength }) => {
        cy.contains(link).click();
        cy.get(".todo-list li").should("have.length", expectedLength);
      });
    });
  });
});
