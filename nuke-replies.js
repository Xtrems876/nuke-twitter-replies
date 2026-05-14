// Default limit of 312 matches Twitter/X's typical per-session reply page load capacity.
async function bulkDeleteTwitterReplies(handle, limit = 312) {
    if (!handle) {
        console.error("Please provide your Twitter handle, e.g. bulkDeleteTwitterReplies('@YourHandle')");
        return;
    }

    // Normalize handle: ensure it starts with '@'
    const normalizedHandle = handle.startsWith('@') ? handle : '@' + handle;

    let deletedCount = 0;

    for (let i = 0; i < limit; i++) {
        // 1. Find the next reply by your handle
        const findTarget = () => Array.from(document.querySelectorAll('article[data-testid="tweet"]'))
            .find(article => article.innerText.includes(normalizedHandle));

        let target = findTarget();

        // 2. Scroll if not found
        if (!target) {
            window.scrollBy(0, 1000);
            await new Promise(r => setTimeout(r, 2000));
            target = findTarget();
            if (!target) {
                console.log("No more replies found. Try scrolling down manually.");
                break;
            }
        }

        try {
            // 3. Open the "More" menu
            target.scrollIntoView({ behavior: 'smooth', block: 'center' });
            const caret = target.querySelector('[data-testid="caret"]');
            if (!caret) continue;
            caret.click();

            await new Promise(r => setTimeout(r, 600));

            // 4. Find and click "Delete" (Supports English and Polish)
            const menuItems = Array.from(document.querySelectorAll('[role="menuitem"]'));
            const deleteBtn = menuItems.find(el =>
                el.innerText.includes('Delete') || el.innerText.includes('Usuń')
            );

            if (deleteBtn) {
                deleteBtn.click();
                await new Promise(r => setTimeout(r, 600));

                // 5. Confirm deletion
                const confirm = document.querySelector('[data-testid="confirmationSheetConfirm"]');
                if (confirm) {
                    confirm.click();
                    deletedCount++;
                    console.log(`Deleted: ${deletedCount}/${limit}`);
                    // Wait for the UI to settle
                    await new Promise(r => setTimeout(r, 1500));
                }
            } else {
                // Click away if delete not found to close the menu
                document.body.click();
                await new Promise(r => setTimeout(r, 500));
            }
        } catch (err) {
            console.error("Batch error, skipping to next...", err);
            await new Promise(r => setTimeout(r, 1000));
        }
    }
    console.log(`Finished! Total deleted: ${deletedCount}`);
}

// Execute the function — replace '@YourHandle' with your own Twitter/X handle
bulkDeleteTwitterReplies('@YourHandle');
