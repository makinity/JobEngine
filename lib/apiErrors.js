export function jsonError(message, status = 500, details) {
  const body = { error: message };

  if (details) {
    body.details = details;
  }

  return Response.json(body, { status });
}

export function validationError(error) {
  return jsonError("Invalid request body.", 400, error.flatten().fieldErrors);
}

export function isMissingApplicationsUserId(error) {
  return error?.message?.includes("applications.user_id");
}

export function missingApplicationsUserIdError() {
  return jsonError(
    "Applications table setup is incomplete. Add the user_id column using the SQL in README.md.",
    500,
  );
}
