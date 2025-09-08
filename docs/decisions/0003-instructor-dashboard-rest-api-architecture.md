ADR-0003 Instructor Dashboard REST API Architecture
===================================================

Decision
--------

Implement unified Instructor Dashboard REST API with service
orchestration pattern organizing 90 endpoints across 12 functional
domains.

API Endpoints & Services
------------------------

Course Information API
~~~~~~~~~~~~~~~~~~~~~~

+-------------------+------------------------+------------------------+
| Method            | Endpoint               | Services               |
+===================+========================+========================+
| GET               | ``/a                   | instructor,            |
|                   | pi/instructor/v1/cours | xmodule.modulestore    |
|                   | es/{course_key}/info`` |                        |
+-------------------+------------------------+------------------------+
| PUT               | ``/a                   | instructor,            |
|                   | pi/instructor/v1/cours | xmodule.modulestore    |
|                   | es/{course_key}/info`` |                        |
+-------------------+------------------------+------------------------+
| GET               | ``/api/instructo       | instructor_task        |
|                   | r/v1/courses/{course_k |                        |
|                   | ey}/instructor_tasks`` |                        |
+-------------------+------------------------+------------------------+
| GET               | ``/ap                  | course_modes           |
|                   | i/instructor/v1/course |                        |
|                   | s/{course_key}/modes`` |                        |
+-------------------+------------------------+------------------------+
| PUT               | ``/api/instructor/v1/  | course_modes           |
|                   | courses/{course_key}/m |                        |
|                   | odes/{mode_id}/price`` |                        |
+-------------------+------------------------+------------------------+

Membership Management API
~~~~~~~~~~~~~~~~~~~~~~~~~

+-------------------+------------------------+------------------------+
| Method            | Endpoint               | Services               |
+===================+========================+========================+
| GET               | ``/api/ins             | enrollments, student   |
|                   | tructor/v1/courses/{co |                        |
|                   | urse_key}/enrollment`` |                        |
+-------------------+------------------------+------------------------+
| POST              | ``/api/ins             | enrollments, student   |
|                   | tructor/v1/courses/{co |                        |
|                   | urse_key}/enrollment`` |                        |
+-------------------+------------------------+------------------------+
| DELETE            | ``/api/ins             | enrollments, student   |
|                   | tructor/v1/courses/{co |                        |
|                   | urse_key}/enrollment`` |                        |
+-------------------+------------------------+------------------------+
| POST              | ``/api/instructo       | bulk_enroll,           |
|                   | r/v1/courses/{course_k | bulk_email             |
|                   | ey}/enrollment/batch`` |                        |
+-------------------+------------------------+------------------------+
| POST              | ``/api/instructor/v1/  | bulk_enroll, util      |
|                   | courses/{course_key}/e |                        |
|                   | nrollment/csv_upload`` |                        |
+-------------------+------------------------+------------------------+
| GET               | ``/ap                  | student.auth           |
|                   | i/instructor/v1/course |                        |
|                   | s/{course_key}/roles`` |                        |
+-------------------+------------------------+------------------------+
| POST              | ``/ap                  | student.auth           |
|                   | i/instructor/v1/course |                        |
|                   | s/{course_key}/roles`` |                        |
+-------------------+------------------------+------------------------+
| DELETE            | ``/ap                  | student.auth           |
|                   | i/instructor/v1/course |                        |
|                   | s/{course_key}/roles`` |                        |
+-------------------+------------------------+------------------------+
| GET               | ``/                    | student.auth           |
|                   | api/instructor/v1/cour |                        |
|                   | ses/{course_key}/roles |                        |
|                   | /{role_type}/members`` |                        |
+-------------------+------------------------+------------------------+
| GET               | ``/api/instr           | student.auth           |
|                   | uctor/v1/courses/{cour |                        |
|                   | se_key}/beta_testers`` |                        |
+-------------------+------------------------+------------------------+
| POST              | ``/api/instr           | student.auth           |
|                   | uctor/v1/courses/{cour |                        |
|                   | se_key}/beta_testers`` |                        |
+-------------------+------------------------+------------------------+
| DELETE            | ``/api/instr           | student.auth           |
|                   | uctor/v1/courses/{cour |                        |
|                   | se_key}/beta_testers`` |                        |
+-------------------+------------------------+------------------------+
| GET               | ``/api/instru          | discussion,            |
|                   | ctor/v1/courses/{cours | student.auth           |
|                   | e_key}/forum/members`` |                        |
+-------------------+------------------------+------------------------+
| POST              | ``/api/instru          | discussion,            |
|                   | ctor/v1/courses/{cours | student.auth           |
|                   | e_key}/forum/members`` |                        |
+-------------------+------------------------+------------------------+
| DELETE            | ``/api/instru          | discussion,            |
|                   | ctor/v1/courses/{cours | student.auth           |
|                   | e_key}/forum/members`` |                        |
+-------------------+------------------------+------------------------+

Student Administration API
~~~~~~~~~~~~~~~~~~~~~~~~~~

+-------------------+------------------------+------------------------+
| Method            | Endpoint               | Services               |
+===================+========================+========================+
| GET               | ``/api/i               | student, instructor    |
|                   | nstructor/v1/courses/{ |                        |
|                   | course_key}/students`` |                        |
+-------------------+------------------------+------------------------+
| GET               | ``/api/instructor/v    | student, instructor    |
|                   | 1/courses/{course_key} |                        |
|                   | /students/{username}`` |                        |
+-------------------+------------------------+------------------------+
| GET               | ``/api/instruct        | enrollments            |
|                   | or/v1/courses/{course_ |                        |
|                   | key}/students/{usernam |                        |
|                   | e}/enrollment_status`` |                        |
+-------------------+------------------------+------------------------+
| GET               | ``/api/ins             | student, instructor    |
|                   | tructor/v1/courses/{co |                        |
|                   | urse_key}/students/{us |                        |
|                   | ername}/progress_url`` |                        |
+-------------------+------------------------+------------------------+
| POST              | ``/api/instr           | grades,                |
|                   | uctor/v1/courses/{cour | xmodule.modulestore,   |
|                   | se_key}/students/{user | instructor_task        |
|                   | name}/reset_attempts`` |                        |
+-------------------+------------------------+------------------------+
| POST              | ``/api/instructor      | grades,                |
|                   | /v1/courses/{course_ke | xmodule.modulestore    |
|                   | y}/students/{username} |                        |
|                   | /reset_entrance_exam`` |                        |
+-------------------+------------------------+------------------------+
| POST              | ``/api/instru          | grades,                |
|                   | ctor/v1/courses/{cours | xmodule.modulestore,   |
|                   | e_key}/students/{usern | instructor_task        |
|                   | ame}/rescore_problem`` |                        |
+-------------------+------------------------+------------------------+
| POST              | ``/api/instr           | grades,                |
|                   | uctor/v1/courses/{cour | xmodule.modulestore    |
|                   | se_key}/students/{user |                        |
|                   | name}/override_score`` |                        |
+-------------------+------------------------+------------------------+
| POST              | ``/api/ins             | student,               |
|                   | tructor/v1/courses/{co | xmodule.modulestore    |
|                   | urse_key}/students/{us |                        |
|                   | ername}/delete_state`` |                        |
+-------------------+------------------------+------------------------+
| POST              | ``/api/instructor/     | grades,                |
|                   | v1/courses/{course_key | xmodule.modulestore,   |
|                   | }/problems/{problem_id | instructor_task        |
|                   | }/reset_attempts_all`` |                        |
+-------------------+------------------------+------------------------+
| POST              | ``/api/inst            | grades,                |
|                   | ructor/v1/courses/{cou | xmodule.modulestore,   |
|                   | rse_key}/problems/{pro | instructor_task        |
|                   | blem_id}/rescore_all`` |                        |
+-------------------+------------------------+------------------------+

Cohort Management API
~~~~~~~~~~~~~~~~~~~~~

+-------------------+------------------------+------------------------+
| Method            | Endpoint               | Services               |
+===================+========================+========================+
| GET               | ``/api/                | openedx.core.dj        |
|                   | instructor/v1/courses/ | angoapps.course_groups |
|                   | {course_key}/cohorts`` |                        |
+-------------------+------------------------+------------------------+
| POST              | ``/api/                | openedx.core.dj        |
|                   | instructor/v1/courses/ | angoapps.course_groups |
|                   | {course_key}/cohorts`` |                        |
+-------------------+------------------------+------------------------+
| PUT               | ``/api/instructor/v    | openedx.core.dj        |
|                   | 1/courses/{course_key} | angoapps.course_groups |
|                   | /cohorts/{cohort_id}`` |                        |
+-------------------+------------------------+------------------------+
| DELETE            | ``/api/instructor/v    | openedx.core.dj        |
|                   | 1/courses/{course_key} | angoapps.course_groups |
|                   | /cohorts/{cohort_id}`` |                        |
+-------------------+------------------------+------------------------+
| POST              | ``/api                 | openedx.core.dj        |
|                   | /instructor/v1/courses | angoapps.course_groups |
|                   | /{course_key}/cohorts/ |                        |
|                   | {cohort_id}/students`` |                        |
+-------------------+------------------------+------------------------+
| DELETE            | ``/api                 | openedx.core.dj        |
|                   | /instructor/v1/courses | angoapps.course_groups |
|                   | /{course_key}/cohorts/ |                        |
|                   | {cohort_id}/students`` |                        |
+-------------------+------------------------+------------------------+
| POST              | ``/api/instructor/     | openedx.core.dja       |
|                   | v1/courses/{course_key | ngoapps.course_groups, |
|                   | }/cohorts/csv_upload`` | util                   |
+-------------------+------------------------+------------------------+

Discussion Management API
~~~~~~~~~~~~~~~~~~~~~~~~~

+-------------------+------------------------+------------------------+
| Method            | Endpoint               | Services               |
+===================+========================+========================+
| GET               | ``/api/instructor/     | discussion             |
|                   | v1/courses/{course_key |                        |
|                   | }/discussions/topics`` |                        |
+-------------------+------------------------+------------------------+
| POST              | ``/api/instructor/     | discussion,            |
|                   | v1/courses/{course_key | xmodule.modulestore    |
|                   | }/discussions/topics`` |                        |
+-------------------+------------------------+------------------------+
| PUT               | ``/api/                | discussion             |
|                   | instructor/v1/courses/ |                        |
|                   | {course_key}/discussio |                        |
|                   | ns/topics/{topic_id}`` |                        |
+-------------------+------------------------+------------------------+
| DELETE            | ``/api/                | discussion             |
|                   | instructor/v1/courses/ |                        |
|                   | {course_key}/discussio |                        |
|                   | ns/topics/{topic_id}`` |                        |
+-------------------+------------------------+------------------------+
| GET               | ``/api/instructor/v1   | discussion             |
|                   | /courses/{course_key}/ |                        |
|                   | discussions/settings`` |                        |
+-------------------+------------------------+------------------------+
| PUT               | ``/api/instructor/v1   | discussion             |
|                   | /courses/{course_key}/ |                        |
|                   | discussions/settings`` |                        |
+-------------------+------------------------+------------------------+

Extensions & Deadlines API
~~~~~~~~~~~~~~~~~~~~~~~~~~

+-------------------+------------------------+------------------------+
| Method            | Endpoint               | Services               |
+===================+========================+========================+
| GET               | ``/api/ins             | util.date_utils        |
|                   | tructor/v1/courses/{co |                        |
|                   | urse_key}/extensions`` |                        |
+-------------------+------------------------+------------------------+
| POST              | ``/api/ins             | util.date_utils        |
|                   | tructor/v1/courses/{co |                        |
|                   | urse_key}/extensions`` |                        |
+-------------------+------------------------+------------------------+
| PUT               | ``/                    | util.date_utils        |
|                   | api/instructor/v1/cour |                        |
|                   | ses/{course_key}/exten |                        |
|                   | sions/{extension_id}`` |                        |
+-------------------+------------------------+------------------------+
| DELETE            | ``/                    | util.date_utils        |
|                   | api/instructor/v1/cour |                        |
|                   | ses/{course_key}/exten |                        |
|                   | sions/{extension_id}`` |                        |
+-------------------+------------------------+------------------------+
| GET               | ``/api/instructor/v1/  | util.date_utils,       |
|                   | courses/{course_key}/e | student                |
|                   | xtensions/{username}`` |                        |
+-------------------+------------------------+------------------------+

Data Export API
~~~~~~~~~~~~~~~

+-------------------+------------------------+------------------------+
| Method            | Endpoint               | Services               |
+===================+========================+========================+
| GET               | ``/api/instruc         | instructor_task, util  |
|                   | tor/v1/courses/{course |                        |
|                   | _key}/data_downloads`` |                        |
+-------------------+------------------------+------------------------+
| POST              | ``/api/instruc         | instructor_task, util  |
|                   | tor/v1/courses/{course |                        |
|                   | _key}/data_downloads`` |                        |
+-------------------+------------------------+------------------------+
| GET               | ``/api                 | instructor_task, util  |
|                   | /instructor/v1/courses |                        |
|                   | /{course_key}/data_dow |                        |
|                   | nloads/{download_id}`` |                        |
+-------------------+------------------------+------------------------+
| DELETE            | ``/api                 | instructor_task, util  |
|                   | /instructor/v1/courses |                        |
|                   | /{course_key}/data_dow |                        |
|                   | nloads/{download_id}`` |                        |
+-------------------+------------------------+------------------------+
| POST              | ``/api/in              | instructor_task,       |
|                   | structor/v1/courses/{c | student                |
|                   | ourse_key}/data_downlo |                        |
|                   | ads/student_profiles`` |                        |
+-------------------+------------------------+------------------------+
| POST              | ``/ap                  | instructor_task,       |
|                   | i/instructor/v1/course | grades                 |
|                   | s/{course_key}/data_do |                        |
|                   | wnloads/grade_report`` |                        |
+-------------------+------------------------+------------------------+
| POST              | ``/api/instru          | instructor_task,       |
|                   | ctor/v1/courses/{cours | grades                 |
|                   | e_key}/data_downloads/ |                        |
|                   | problem_grade_report`` |                        |
+-------------------+------------------------+------------------------+
| POST              | ``/api/in              | instructor_task,       |
|                   | structor/v1/courses/{c | xmodule.modulestore    |
|                   | ourse_key}/data_downlo |                        |
|                   | ads/course_structure`` |                        |
+-------------------+------------------------+------------------------+
| POST              | ``/api/                | instructor_task,       |
|                   | instructor/v1/courses/ | grades                 |
|                   | {course_key}/data_down |                        |
|                   | loads/survey_results`` |                        |
+-------------------+------------------------+------------------------+

Bulk Email API
~~~~~~~~~~~~~~

+-------------------+------------------------+------------------------+
| Method            | Endpoint               | Services               |
+===================+========================+========================+
| GET               | ``/api/ins             | bulk_email             |
|                   | tructor/v1/courses/{co |                        |
|                   | urse_key}/bulk_email`` |                        |
+-------------------+------------------------+------------------------+
| POST              | ``/api/ins             | bulk_email,            |
|                   | tructor/v1/courses/{co | instructor_task        |
|                   | urse_key}/bulk_email`` |                        |
+-------------------+------------------------+------------------------+
| GET               | ``/api/instructor/v1/  | bulk_email             |
|                   | courses/{course_key}/b |                        |
|                   | ulk_email/{email_id}`` |                        |
+-------------------+------------------------+------------------------+
| GET               | ``/api                 | bulk_email,            |
|                   | /instructor/v1/courses | instructor_task        |
|                   | /{course_key}/bulk_ema |                        |
|                   | il/{email_id}/status`` |                        |
+-------------------+------------------------+------------------------+
| DELETE            | ``/api/instructor/v1/  | bulk_email             |
|                   | courses/{course_key}/b |                        |
|                   | ulk_email/{email_id}`` |                        |
+-------------------+------------------------+------------------------+
| GET               | ``/api/instruct        | bulk_email             |
|                   | or/v1/courses/{course_ |                        |
|                   | key}/email_templates`` |                        |
+-------------------+------------------------+------------------------+

Special Exams API
~~~~~~~~~~~~~~~~~

+-------------------+------------------------+------------------------+
| Method            | Endpoint               | Services               |
+===================+========================+========================+
| GET               | ``/api/instru          | edx_proctoring, grades |
|                   | ctor/v1/courses/{cours |                        |
|                   | e_key}/special_exams`` |                        |
+-------------------+------------------------+------------------------+
| GET               | `                      | edx_proctoring, grades |
|                   | `/api/instructor/v1/co |                        |
|                   | urses/{course_key}/spe |                        |
|                   | cial_exams/{exam_id}`` |                        |
+-------------------+------------------------+------------------------+
| POST              | ``/api/instructor/     | edx_proctoring,        |
|                   | v1/courses/{course_key | InstructorService      |
|                   | }/special_exams/{exam_ |                        |
|                   | id}/reset/{username}`` |                        |
+-------------------+------------------------+------------------------+
| GET               | ``/api/ins             | edx_proctoring, grades |
|                   | tructor/v1/courses/{co |                        |
|                   | urse_key}/special_exam |                        |
|                   | s/{exam_id}/attempts`` |                        |
+-------------------+------------------------+------------------------+
| GET               | ``/api/instructor/v    | edx_proctoring         |
|                   | 1/courses/{course_key} |                        |
|                   | /proctoring_settings`` |                        |
+-------------------+------------------------+------------------------+
| PUT               | ``/api/instructor/v    | edx_proctoring         |
|                   | 1/courses/{course_key} |                        |
|                   | /proctoring_settings`` |                        |
+-------------------+------------------------+------------------------+
| POST              | ``/api/inst            | edx_proctoring,        |
|                   | ructor/v1/courses/{cou | student                |
|                   | rse_key}/special_exams |                        |
|                   | /{exam_id}/allowance`` |                        |
+-------------------+------------------------+------------------------+

Certificates API
~~~~~~~~~~~~~~~~

+-------------------+------------------------+------------------------+
| Method            | Endpoint               | Services               |
+===================+========================+========================+
| GET               | ``/api/instr           | certificates           |
|                   | uctor/v1/courses/{cour |                        |
|                   | se_key}/certificates`` |                        |
+-------------------+------------------------+------------------------+
| POST              | ``/api/instructor/v1/  | certificates,          |
|                   | courses/{course_key}/c | instructor_task        |
|                   | ertificates/generate`` |                        |
+-------------------+------------------------+------------------------+
| POST              | ``/api/ins             | certificates, student  |
|                   | tructor/v1/courses/{co |                        |
|                   | urse_key}/certificates |                        |
|                   | /generate/{username}`` |                        |
+-------------------+------------------------+------------------------+
| POST              | ``/a                   | certificates,          |
|                   | pi/instructor/v1/cours | instructor_task        |
|                   | es/{course_key}/certif |                        |
|                   | icates/generate_bulk`` |                        |
+-------------------+------------------------+------------------------+
| GET               | ``/api/instructor/v1/c | certificates           |
|                   | ourses/{course_key}/ce |                        |
|                   | rtificates/allowlist`` |                        |
+-------------------+------------------------+------------------------+
| POST              | ``/api/instructor/v1/c | certificates, student  |
|                   | ourses/{course_key}/ce |                        |
|                   | rtificates/allowlist`` |                        |
+-------------------+------------------------+------------------------+
| DELETE            | ``/api/instructor/v1/c | certificates           |
|                   | ourses/{course_key}/ce |                        |
|                   | rtificates/allowlist`` |                        |
+-------------------+------------------------+------------------------+
| GET               | ``/api/instruc         | certificates           |
|                   | tor/v1/courses/{course |                        |
|                   | _key}/certificates/{ce |                        |
|                   | rtificate_id}/status`` |                        |
+-------------------+------------------------+------------------------+

Open Response Assessment API
~~~~~~~~~~~~~~~~~~~~~~~~~~~~

+-------------------+------------------------+------------------------+
| Method            | Endpoint               | Services               |
+===================+========================+========================+
| GET               | ``/                    | ora_staff_grader,      |
|                   | api/instructor/v1/cour | xmodule.modulestore    |
|                   | ses/{course_key}/ora`` |                        |
+-------------------+------------------------+------------------------+
| GET               | ``/api/instr           | ora_staff_grader,      |
|                   | uctor/v1/courses/{cour | xmodule.modulestore    |
|                   | se_key}/ora/{ora_id}`` |                        |
+-------------------+------------------------+------------------------+
| GET               | ``                     | ora_staff_grader       |
|                   | /api/instructor/v1/cou |                        |
|                   | rses/{course_key}/ora/ |                        |
|                   | {ora_id}/submissions`` |                        |
+-------------------+------------------------+------------------------+
| GET               | ``/api/instructor/     | ora_staff_grader       |
|                   | v1/courses/{course_key |                        |
|                   | }/ora/{ora_id}/submiss |                        |
|                   | ions/{submission_id}`` |                        |
+-------------------+------------------------+------------------------+
| POST              | ``/api/inst            | ora_staff_grader       |
|                   | ructor/v1/courses/{cou |                        |
|                   | rse_key}/ora/{ora_id}/ |                        |
|                   | submissions/{submissio |                        |
|                   | n_id}/override_grade`` |                        |
+-------------------+------------------------+------------------------+
| POST              | ``                     | ora_staff_grader       |
|                   | /api/instructor/v1/cou |                        |
|                   | rses/{course_key}/ora/ |                        |
|                   | {ora_id}/submissions/{ |                        |
|                   | submission_id}/reset`` |                        |
+-------------------+------------------------+------------------------+

Analytics API
~~~~~~~~~~~~~

+-------------------+------------------------+------------------------+
| Method            | Endpoint               | Services               |
+===================+========================+========================+
| GET               | `                      | instructor_analytics   |
|                   | `/api/instructor/v1/co |                        |
|                   | urses/{course_key}/ana |                        |
|                   | lytics/dashboard_url`` |                        |
+-------------------+------------------------+------------------------+
| GET               | ``/api/instructor      | instructor_analytics,  |
|                   | /v1/courses/{course_ke | student                |
|                   | y}/analytics/summary`` |                        |
+-------------------+------------------------+------------------------+
| GET               | ``/api/instructor/v1   | instructor_analytics   |
|                   | /courses/{course_key}/ |                        |
|                   | analytics/engagement`` |                        |
+-------------------+------------------------+------------------------+
| GET               | ``/api/instructor/v1/  | instructor_analytics,  |
|                   | courses/{course_key}/a | grades                 |
|                   | nalytics/performance`` |                        |
+-------------------+------------------------+------------------------+
| GET               | ``/a                   | instructor_analytics,  |
|                   | pi/instructor/v1/cours | enrollments            |
|                   | es/{course_key}/analyt |                        |
|                   | ics/enrollment_stats`` |                        |
+-------------------+------------------------+------------------------+
