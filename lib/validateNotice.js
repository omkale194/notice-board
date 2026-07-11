const VALID_CATEGORIES = ["Exam", "Event", "General"];
const VALID_PRIORITIES = ["Normal", "Urgent"];

/**
 * Validates a notice payload on the server.
 * Returns { valid: true, data } or { valid: false, errors }.
 * This runs inside the API route regardless of what the browser already checked.
 */
export function validateNotice(body) {
  const errors = {};
  const { title, body: content, category, priority, publishDate, image } = body || {};

  if (typeof title !== "string" || title.trim().length === 0) {
    errors.title = "Title is required.";
  }

  if (typeof content !== "string" || content.trim().length === 0) {
    errors.body = "Body is required.";
  }

  const finalCategory = VALID_CATEGORIES.includes(category) ? category : "General";
  if (category !== undefined && !VALID_CATEGORIES.includes(category)) {
    errors.category = `Category must be one of ${VALID_CATEGORIES.join(", ")}.`;
  }

  const finalPriority = VALID_PRIORITIES.includes(priority) ? priority : "Normal";
  if (priority !== undefined && !VALID_PRIORITIES.includes(priority)) {
    errors.priority = `Priority must be one of ${VALID_PRIORITIES.join(", ")}.`;
  }

  let parsedDate = null;
  if (!publishDate) {
    errors.publishDate = "Publish date is required.";
  } else {
    parsedDate = new Date(publishDate);
    if (Number.isNaN(parsedDate.getTime())) {
      errors.publishDate = "Publish date must be a valid date.";
    }
  }

  if (image !== undefined && image !== null && typeof image !== "string") {
    errors.image = "Image must be a string (URL or data URI).";
  }

  if (Object.keys(errors).length > 0) {
    return { valid: false, errors };
  }

  return {
    valid: true,
    data: {
      title: title.trim(),
      body: content.trim(),
      category: finalCategory,
      priority: finalPriority,
      publishDate: parsedDate,
      image: image || null,
    },
  };
}
