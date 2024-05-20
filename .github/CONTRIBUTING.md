# Contributing

## Submitting a pull request

After you've made your changes, you can submit a pull request. Here's a quick guide on how to do that:

When you submit a pull request, you'll need to include a summary of your changes. This summary should include a description of the changes you made and why you made them. This will help the maintainers understand your changes and decide whether to accept them.

If you're fixing a bug, you should include a description of the bug and how you fixed it. If you're adding a new feature, you should include a description of the feature and how it works.

You should also include any relevant information about your changes, such as any new dependencies you added or any changes you made to the codebase.

If you're adding a new feature, you should also include tests for your changes. This will help ensure that your changes work as expected and don't introduce any new bugs.

We use changesets to manage versioning and changelogs. If your changes affect the public API or existing behavior, you'll need to create a changeset. You can do this by running `npm run changeset` and following the prompts.
The changeset will be added to the `.changeset` directory in the root of the repository. You should include the changeset file in your pull request. The changeset will be used to determine the version number for the next release and will be added to the changelog. The file will be automatically removed when the changeset is published.

For more information on changesets, see the [Changesets CLI documentation](https://github.com/changesets/changesets/blob/main/docs/command-line-options.md#add).

## Versioning

When we release a new version of the package, we use [semantic versioning](https://semver.org/). This means that each release is given a version number that indicates the type of changes that have been made.

- A major release (e.g. 2.0.0) indicates that there are breaking changes in the release. This means that the new version is not backwards-compatible with the previous version.

- A minor release (e.g. 2.1.0) indicates that there are new features in the release, but no breaking changes.

- A patch release (e.g. 2.1.1) indicates that there are bug fixes in the release, but no new features or breaking changes.

When you submit a pull request, you'll need to include a changeset that indicates the type of release that your changes should trigger. This will help to determine the version number for the next release.
