# File Editing Instructions

## Critical Requirements for Using replace_string_in_file

1. **Match Exact Whitespace and Indentation**
   - The `oldString` must match exactly, including all spaces, tabs, and newlines
   - Include at least 3 lines of context BEFORE and AFTER the target text
   - Preserve indentation precisely when copying context

2. **Use Unique Context**
   - Ensure the `oldString` uniquely identifies the single instance to change
   - Include enough surrounding code so the string won't match multiple locations
   - If ambiguous, add more context lines to disambiguate

3. **Avoid Patterns That Fail**
   - Never use partial matches or wildcards
   - Don't use "...existing code..." or placeholder comments
   - Don't escape special characters unless they appear literally in the file

4. **For Multiple Replacements**
   - Use `multi_replace_string_in_file` instead of multiple single calls
   - Each operation should be independent or properly sequenced

5. **Verify Before Replacing**
   - Copy the exact text including whitespace from the file
   - Test that the oldString is found exactly as-is
   - Ensure newlines and indentation match character-for-character