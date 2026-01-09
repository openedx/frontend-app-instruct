Override External URLs
======================

What is getExternalLinkUrl?
---------------------------

The `getExternalLinkUrl` function is a utility from `@openedx/frontend-base` that allows for centralized management of external URLs. It enables the override of external links through configuration, making it possible to customize external references without modifying the source code directly.

URLs wrapped with getExternalLinkUrl
------------------------------------

Currently, the following external URLs are wrapped with `getExternalLinkUrl` in the authoring application:

- https://openedx.atlassian.net/wiki/spaces/ENG/pages/123456789/Cohorts+Feature+Documentation
- https://docs.openedx.org/en/latest/educators/how-tos/advanced_features/manage_cohorts.html#assign-learners-to-cohorts-manually
- https://docs.openedx.org/en/latest/educators/references/advanced_features/managing_cohort_assignment.html#about-auto-cohorts


How to Override External URLs
-----------------------------

To override external URLs, you can use the frontend platform's configuration system.
This object should be added to the config object defined in the env.config.[js,jsx,ts,tsx], and must be named externalLinkUrlOverrides.

1. **Environment Configuration**
   Add the URL overrides to your environment configuration:

   .. code-block:: javascript

      const config = {
        // Other config options...
        externalLinkUrlOverrides: {
          'https://www.edx.org/accessibility': 'https://your-custom-domain.com/accessibility',
          // Add other URL overrides here
        }
      };

Examples
--------

**Original URL:** Default community accessibility link
**Override:** Your institution's accessibility policy page

.. code-block:: javascript

   // In your app configuration
   getExternalLinkUrl('https://www.edx.org/accessibility')
   // Returns: 'https://your-custom-domain.com/accessibility'
   // Instead of the default Open edX community link

Benefits
--------

- **Customization**: Institutions can point to their own resources
- **Maintainability**: URLs can be changed without code modifications  
- **Consistency**: Centralized URL management across the application
- **Flexibility**: Different environments can have different external links
