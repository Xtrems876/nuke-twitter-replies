async function bulkDeleteTwitterReplies(handle, limit = 312) {
    if (!handle) {
        console.error("Please provide your Twitter handle.");
        return;
    }

    const normalizedHandle = handle.startsWith('@') ? handle : '@' + handle;
    let deletedCount = 0;

    for (let i = 0; i < limit; i++) {
        const findTarget = () => Array.from(document.querySelectorAll('article'))
            .find(article => article.innerText.includes(normalizedHandle));

        let target = findTarget();

        if (!target) {
            window.scrollBy(0, 1000);
            await new Promise(r => setTimeout(r, 2000));
            target = findTarget();
            if (!target) break;
        }

        try {
            target.scrollIntoView({ behavior: 'smooth', block: 'center' });
            await new Promise(r => setTimeout(r, 500));

            // 1. Open "More" menu
            const moreBtn = target.querySelector('[aria-label="Więcej"], [aria-label="More"]');
            if (!moreBtn) continue;
            moreBtn.click();
            await new Promise(r => setTimeout(r, 800));

            // 2. Click "Delete" in the menu
            const menuItems = Array.from(document.querySelectorAll('[role="menuitem"], div'));
            const deleteMenuBtn = menuItems.find(el => 
                (el.innerText === 'Delete' || el.innerText === 'Usuń') && 
                el.offsetParent !== null
            );

            if (deleteMenuBtn) {
                deleteMenuBtn.click();
                await new Promise(r => setTimeout(r, 1000));

                // 3. Find and click "Delete" in the confirmation popup
                // We look for a visible button that is NOT inside an article
                const allButtons = Array.from(document.querySelectorAll('button, [role="button"]'));
                const confirmBtn = allButtons.find(b => {
                    const isVisible = b.offsetParent !== null;
                    const isDeleteText = b.innerText === 'Delete' || b.innerText === 'Usuń';
                    const notInArticle = !b.closest('article');
                    return isVisible && isDeleteText && notInArticle;
                });

                if (confirmBtn) {
                    confirmBtn.click();
                    deletedCount++;
                    console.log(`Deleted: ${deletedCount}/${limit}`);
                    // Longer wait for the tweet to actually disappear from DOM
                    await new Promise(r => setTimeout(r, 2500));
                } else {
                    console.log("Confirmation button not found, closing popup...");
                    document.body.click(); 
                }
            } else {
                document.body.click();
            }
        } catch (err) {
            console.error("Error in batch, skipping...", err);
            await new Promise(r => setTimeout(r, 1000));
        }
    }
    console.log(`Finished! Total deleted: ${deletedCount}`);
}

bulkDeleteTwitterReplies('@Xtrems876');
