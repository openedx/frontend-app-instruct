1. Record Architecture Decisions
--------------------------------

Status
------

Accepted

Context
-------

The Open edX platform currently has an Instructor Dashboard that exists as part of the legacy Django-rendered interface. This dashboard provides instructors with essential tools for course management, including student administration, enrollment management, grading tools, data downloads, and communication features.

The current Instructor Dashboard has several significant issues:

*   **Legacy Implementation**: Built using legacy code without modern frontend patterns
*   **Lack of Paragon Usage**: Missing the platform's design system components
*   **Navigation Issues**: Embedded within LMS course navigation alongside learner-facing content
*   **Poor User Experience**: Inconsistent styling, cluttered layout, and misaligned components
*   **Secondary Role**: Instructor tools are hard to find and difficult to use

Several factors have motivated the creation of a new micro-frontend (MFE) for the Instructor Dashboard:

*   **Modernization Initiative**: Open edX is transitioning from legacy Django-rendered pages to modern React-based micro-frontends to improve user experience and maintainability.
*   **Technical Debt**: The existing instructor dashboard has accumulated significant technical complexity, particularly in grading tools, with duplicated functionality across different areas (Staff Debug Info, Gradebook, etc.).
*   **Frontend-Base Migration**: The Open edX ecosystem is moving toward frontend-base as the standard foundation for MFEs, replacing the legacy MFE architecture.
*   **Plugin Integration Complexity**: The current system has various plugin slots for additional tabs and CCX (Custom Course for edX) integration that complicate the conversion process.
*   **Design Consistency**: Need to align with Paragon design system and modern styling used across the platform
*   **Product Experience Enhancement**: Elevate instructor tools to the level of other platform products like Studio and LMS

The key decision point was whether to create a traditional legacy MFE and later migrate to frontend-base (dual-conversion) or build directly on frontend-base as a native implementation.

Decision
--------

We will create the `frontend-app-instruct` repository as a **frontend-base native micro-frontend** that will replace the legacy Instructor Dashboard pages. This initiative combines the MFE conversion with an incremental shift to using Paragon components and modern styling.

The `frontend-app-instruct` MFE will provide the following instructor tools:

*   Course Information (enrollment info, basic course info, pending tasks)
*   Membership Management (student enrollment and access control)
*   Cohorts (student grouping and cohort management)
*   Extensions (deadline extensions and special accommodations)
*   Student Admin (individual student management tools)
*   Data Download (export capabilities for course data)
*   Special Exams (proctored exam management)
*   Certificates (certificate generation and management)
*   Open Responses (open-ended assignment management)
*   Bulk Email (course communication tools)
*   Reports (course analytics and reporting)

We will implement this MFE as frontend-base native from the start, rather than using the legacy MFE architecture.

**Implementation Approach**

The conversion will follow a three-stage approach:

**Stage 1: Product Level Switching for Courses**

*   App Header implementation with dropdown to switch between Learn, Studio, and Instruct
*   Page Level CTAs for navigation between different platform products

**Stage 2: Introduction of Instruct Course Home**

*   Creation of new Instructor Home page with product URL: `/instruct/course/courseurl`
*   Centralized jumping-off point to all instructor tools
*   Navigation system for individual tool pages

**Stage 3: Convert Instructor Tools to use Paragon**

*   All existing instructor dashboard tools redesigned using Paragon components
*   UI improvements and design consistency implementation
*   Modern styling aligned with platform design system

Consequences
------------

By going directly to frontend-base, we eliminate the need for a future migration from legacy MFE to frontend-base MFE, reducing long-term technical debt and development effort. Starting with frontend-base aligns with the platform's strategic direction and ensures longevity. The modern development experience provided by frontend-base offers improved developer tooling, better performance, and more maintainable code structure. This approach ensures consistency with other new MFEs being developed across the platform.

However, frontend-base native implementation may require additional development time compared to legacy MFE conversion, potentially impacting project timelines. The transition necessitates careful review and potential refactoring of existing APIs, particularly converting some POSTs to GETs while ensuring operator compatibility. Custom tabs and plugin integrations will need special consideration during the migration process. The CCX (Custom Course for edX) experience may require its own separate project or careful integration planning, adding complexity to the overall migration strategy.

The team will need to create a DEPR (Deprecation) document for the legacy Instructor Dashboard pages following OEP-0021 processes. Comprehensive API mapping and design documentation will be created, similar to the approach used for the Catalog MFE. The implementation will target Verawood release at the earliest, allowing sufficient development and testing time. Regular community engagement through the Educators Working Group and UX/UI Working Group will be essential to ensure the new MFE meets instructor needs.

References
----------

*   Slack discussion in #inst-dash-mfe-fc-0100 channel (July-August 2025)
*   GitHub issue: "Purpose of this repo" ADR with frontend-base justification #1
*   OEP-0021: Deprecation Process - https://docs.openedx.org/projects/openedx-proposals/en/latest/processes/oep-0021-proc-deprecation.html
*   Frontend-base documentation - https://github.com/openedx/frontend-base](https://github.com/openedx/frontend-base