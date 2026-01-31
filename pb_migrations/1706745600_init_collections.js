/// <reference path="../pb_data/types.d.ts" />

migrate((app) => {
  // Create users collection (auth collection)
  const users = new Collection({
    name: "users",
    type: "auth",
    schema: [
      {
        name: "name",
        type: "text",
        required: true,
      },
      {
        name: "avatar",
        type: "file",
        options: {
          maxSelect: 1,
          maxSize: 5242880,
          mimeTypes: ["image/jpeg", "image/png", "image/webp"],
        },
      },
      {
        name: "freeAnalysesUsed",
        type: "number",
        options: {
          min: 0,
        },
      },
      {
        name: "subscriptionStatus",
        type: "select",
        options: {
          values: ["active", "canceled", "past_due"],
        },
      },
      {
        name: "stripeCustomerId",
        type: "text",
      },
      {
        name: "subscriptionEndsAt",
        type: "date",
      },
      {
        name: "status",
        type: "select",
        options: {
          values: ["active", "suspended", "banned"],
        },
      },
    ],
    indexes: [],
    oauth2: {
      enabled: true,
      mappedFields: {
        id: "",
        name: "name",
        avatarURL: "avatar",
      },
    },
  });
  app.save(users);

  // Create rubrics collection
  const rubrics = new Collection({
    name: "rubrics",
    type: "base",
    schema: [
      {
        name: "userId",
        type: "relation",
        options: {
          collectionId: users.id,
          cascadeDelete: false,
          maxSelect: 1,
        },
      },
      {
        name: "name",
        type: "text",
        required: true,
      },
      {
        name: "criteria",
        type: "json",
        required: true,
      },
      {
        name: "source",
        type: "select",
        required: true,
        options: {
          values: ["pasted", "uploaded", "manual"],
        },
      },
    ],
  });
  app.save(rubrics);

  // Create papers collection
  const papers = new Collection({
    name: "papers",
    type: "base",
    schema: [
      {
        name: "userId",
        type: "relation",
        options: {
          collectionId: users.id,
          cascadeDelete: false,
          maxSelect: 1,
        },
      },
      {
        name: "title",
        type: "text",
        required: true,
      },
      {
        name: "content",
        type: "text",
        required: true,
      },
      {
        name: "file",
        type: "file",
        options: {
          maxSelect: 1,
          maxSize: 10485760,
          mimeTypes: [
            "application/pdf",
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
            "text/plain",
          ],
        },
      },
    ],
  });
  app.save(papers);

  // Create analyses collection
  const analyses = new Collection({
    name: "analyses",
    type: "base",
    schema: [
      {
        name: "paperId",
        type: "relation",
        required: true,
        options: {
          collectionId: papers.id,
          cascadeDelete: true,
          maxSelect: 1,
        },
      },
      {
        name: "rubricId",
        type: "relation",
        options: {
          collectionId: rubrics.id,
          cascadeDelete: false,
          maxSelect: 1,
        },
      },
      {
        name: "scores",
        type: "json",
        required: true,
      },
      {
        name: "feedback",
        type: "json",
        required: true,
      },
      {
        name: "highlights",
        type: "json",
      },
      {
        name: "aiProvider",
        type: "select",
        required: true,
        options: {
          values: ["groq", "xai"],
        },
      },
      {
        name: "overallScore",
        type: "number",
        options: {
          min: 0,
          max: 10,
        },
      },
    ],
  });
  app.save(analyses);

  // Create admin_settings collection
  const adminSettings = new Collection({
    name: "admin_settings",
    type: "base",
    schema: [
      {
        name: "primaryProvider",
        type: "select",
        required: true,
        options: {
          values: ["groq", "xai"],
        },
      },
      {
        name: "fallbackEnabled",
        type: "bool",
      },
      {
        name: "dailyLimitAnon",
        type: "number",
        options: {
          min: 0,
        },
      },
      {
        name: "dailyLimitAuth",
        type: "number",
        options: {
          min: 0,
        },
      },
    ],
  });
  app.save(adminSettings);

}, (app) => {
  // Rollback
  app.delete(app.findCollectionByNameOrId("analyses"));
  app.delete(app.findCollectionByNameOrId("papers"));
  app.delete(app.findCollectionByNameOrId("rubrics"));
  app.delete(app.findCollectionByNameOrId("users"));
  app.delete(app.findCollectionByNameOrId("admin_settings"));
});
