# Mongo DB Modeling

This folder contains practice projects for MongoDB data modeling. While working here I learned how to design proper Mongoose schemas, structure models clearly, and create relations between documents when needed.

What I practiced

- Writing clear, reusable Mongoose schemas.
- Choosing appropriate field types and validation.
- Designing relations (refs) between models where appropriate.
- Organizing models into logical folders by domain.

Models included

- ecommerce/

  - `category.models.js`
  - `order.models.js`
  - `product.models.js`
  - `user.models.js`

- hospital-management/

  - `doctor.models.js`
  - `hospital.models.js`
  - `medical_record.models.js`
  - `patient.models.js`

- todos/
  - `sub_todos.models.js`
  - `todos.models.js`
  - `user.models.js`

Notes

- These files demonstrate various modeling patterns: embedded documents, references, indexes, and validation rules.
- Use these as learning references — adapt and harden schemas before using them in production (add indexes, constraints, and security checks as needed).
