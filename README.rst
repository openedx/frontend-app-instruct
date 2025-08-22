frontend-app-instruct
#############################

|license-badge| |status-badge| |ci-badge| |codecov-badge|


Purpose
*******

This repository implements a micro-frontend for Instructor Dashboard, providing a seamless 
and integrated user experience for instructors. It focuses on providing tools and features 
specifically designed for instructors to track student progress, and facilitate communication with learners.

### What is the domain of this MFE?
- Course information (Enrollment info, Basic course info, Pending tasks)
- Membership
- Cohorts
- Extensions
- Student Admin
- Data Download
- Special Exams
- Certificates
- Open Responses

Getting Started
***************

After copying the template repository, you'll want to do a find-and-replace to
replace all instances of ``frontend-app-instruct`` with the name of
your new repository.  Also edit index.html to replace "Application Template"
with a friendly name for this application that users will see in their browser
tab.

Prerequisites
=============

`Tutor`_ is recommended as the development environment for your new frontend
app.  You can refer to the `relevant tutor-mfe documentation`_ to get started
using it.

.. _Tutor: https://github.com/overhangio/tutor

.. _relevant tutor-mfe documentation: https://github.com/overhangio/tutor-mfe#mfe-development

Cloning and Startup
===================

1. Clone your new repo:

  ``git clone https://github.com/openedx/frontend-app-instruct.git``

2. Use node v20.x.

   The current version of the micro-frontend build scripts support node 20.
   Using other major versions of node *may* work, but this is unsupported.  For
   convenience, this repository includes an .nvmrc file to help in setting the
   correct node version via `nvm <https://github.com/nvm-sh/nvm>`_.

3. Install npm dependencies:

  ``cd frontend-app-instruct && npm install``

4. Update the application port to use for local development:

   Default port is 8080. If this does not work for you, update the line
   `PORT=8080` to your port in ``site.config.dev.tsx``.

5. Start the dev server:

  ``npm run dev``

The dev server is running at `http://apps.local.openedx.io:8080 <http://apps.local.openedx.io:8080>`_
or whatever port you setup.

Project Structure
=================

The source for this project is organized into nested submodules according to
the `Feature-based Application Organization ADR`_.

.. _Feature-based Application Organization ADR: https://github.com/openedx/frontend-app-instruct/blob/master/docs/decisions/0002-feature-based-application-organization.rst

Internationalization
====================

Please see refer to the `frontend-base i18n howto`_ for documentation on
internationalization.

.. _frontend-base i18n howto: https://github.com/openedx/frontend-base/blob/master/docs/how_tos/i18n.rst

Getting Help
************

If you're having trouble, we have discussion forums at
https://discuss.openedx.org where you can connect with others in the community.

Our real-time conversations are on Slack. You can request a `Slack
invitation`_, then join our `community Slack workspace`_.  Because this is a
frontend repository, the best place to discuss it would be in the `#wg-frontend
channel`_.

For anything non-trivial, the best path is to open an issue in this repository
with as many details about the issue you are facing as you can provide.

https://github.com/openedx/frontend-app-instruct/issues

For more information about these options, see the `Getting Help`_ page.

.. _Slack invitation: https://openedx.org/slack
.. _community Slack workspace: https://openedx.slack.com/
.. _#wg-frontend channel: https://openedx.slack.com/archives/C04BM6YC7A6
.. _Getting Help: https://openedx.org/getting-help

License
*******

The code in this repository is licensed under the AGPLv3 unless otherwise
noted.

Please see `LICENSE <LICENSE>`_ for details.

Contributing
************

Contributions are very welcome.  Please read `How To Contribute`_ for details.

.. _How To Contribute: https://openedx.org/r/how-to-contribute

This project is currently accepting all types of contributions, bug fixes,
security fixes, maintenance work, or new features.  However, please make sure
to have a discussion about your new feature idea with the maintainers prior to
beginning development to maximize the chances of your change being accepted.
You can start a conversation by creating a new issue on this repo summarizing
your idea.

The Open edX Code of Conduct
****************************

All community members are expected to follow the `Open edX Code of Conduct`_.

.. _Open edX Code of Conduct: https://openedx.org/code-of-conduct/

People
******

The assigned maintainers for this component and other project details may be
found in `Backstage`_. Backstage pulls this data from the ``catalog-info.yaml``
file in this repo.

.. _Backstage: https://open-edx-backstage.herokuapp.com/catalog/default/component/frontend-app-instruct

Reporting Security Issues
*************************

Please do not report security issues in public, and email security@openedx.org instead.

.. |license-badge| image:: https://img.shields.io/github/license/openedx/frontend-app-instruct.svg
    :target: https://github.com/openedx/frontend-app-instruct/blob/main/LICENSE
    :alt: License

.. |status-badge| image:: https://img.shields.io/badge/Status-Maintained-brightgreen

.. |ci-badge| image:: https://github.com/openedx/frontend-app-instruct/actions/workflows/ci.yml/badge.svg
    :target: https://github.com/openedx/frontend-app-instruct/actions/workflows/ci.yml
    :alt: Continuous Integration

.. |codecov-badge| image:: https://codecov.io/github/openedx/frontend-app-instruct/coverage.svg?branch=main
    :target: https://codecov.io/github/openedx/frontend-app-instruct?branch=main
    :alt: Codecov
