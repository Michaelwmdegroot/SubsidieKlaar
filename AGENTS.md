# SubsidieKlaar engineering notes

- Working name: SubsidieKlaar. Do not assume SubsidieKlaar.nl belongs to this project.
- The owner selected GitHub `main` and Hostinger as the eventual deployment route.
- The current release is a working concept. Preserve the noindex status until the product launch decision.
- Keep the complete individual tool usable for free without signup, a paid dependency or a paid runtime AI API.
- Preserve browser-local document processing. Do not introduce remote uploads or silently persist original documents.
- Label concept analytics as local browser data. They are not central visitor counts or unique people.
- Read `docs/RVO-sources.md` before changing rules. Document presence is separate from subsidy eligibility or official approval.
- An absent meldcode can use the technical-documentation route; an absent heat-pump photo alone is not a mandatory failure.
- Invalidate relevant manual confirmations when underlying data or documents change.
- Treat user input, filenames and imported JSON as untrusted data. Keep archive paths safe and originals byte-identical.
- Preserve explicit demo markings in example documents and exports.
- Keep `docs/DEVELOPMENT-HANDOFF.md` and `docs/RELEASE-GATES.md` in mind. A green CI run is not permission to launch or remove noindex.
- After code changes run the meaningful checks with `npm test`, then regenerate the portable HTML with `npm run build`.
- Keep third-party licence notices in `vendor/` and in the portable distribution. Do not grant an application-wide open-source licence by accident.
- Never commit credentials, real customer documents, personal data or temporary QA downloads.
