(function () {
    const delimiter = '-'

    const itemQueries = {
        sprintItem: target => {
            const wrapper = target.closest('.ghx-issue')
            if (!wrapper) {
                console.warn('Could not find ticket wrapper on sprint board')

                return;
            }

            const id = (() => {
                const element = wrapper.querySelector('a.ghx-key')

                if (!element) {
                    console.warn(`Could not find ticket's issue key element`)
                }

                return wrapper.querySelector('a.ghx-key').href.replace(/.*\/(.*)$/, '$1')
            })()

            const name = (() => {
                const element = wrapper.querySelector('.ghx-summary')
                if (!element) {
                    console.warn(`Could not find ticket's summary element`)
                }
                return element.textContent.trim().toLowerCase().split(":").pop()
            })()

            return {id, name}
        },
        backglogItem: target => {
            const wrapper = target.closest('.js-issue')
            if (!wrapper) {
                console.warn('Could not find ticket wrapper on backlog')
                return
            }

            const id = (() => {
                const element = wrapper.querySelector('a.ghx-key')
                if (!element) console.warn(`Could not find ticket's issue key element`)
                return element.href.replace(/.*\/(.*)$/, '$1')
            })()

            const name = (() => {
                const element = wrapper.querySelector('.ghx-summary')
                if (!element) console.warn(`Could not find ticket's summary element`)
                return element.textContent.trim().toLowerCase().split(":").pop()
            })()

            return {id, name}
        }
    }

    function toBranchName(prefix, {id, name}) {
        name = name
            .replace(/^(\[.*?\])/m, '')
            .replace(/^[^\w]+/, '')
            .replace(/[^\w]+$/, '')
            .replace(/[^\w]+/g, delimiter)

        return `${prefix}/${id}-${name}`
    }

    chrome.storage.sync.get(['prefix'], async function(items) {
        const prefix = await items.prefix;

        document.addEventListener('click', async event => {
            event.stopPropagation()
            if (event.ctrlKey && event.altKey) {
                event.preventDefault()
            }


            // first check targets, do not override any other possible bindings
            const queryResults = Object.values(itemQueries).map(query => query(event.target)).find(Boolean)
            if (!queryResults || !event.ctrlKey || !event.altKey) return

            // do not open the ticket in a new tab when clicking on the link
            event.preventDefault()

            const branchName = toBranchName(prefix, queryResults)
            await navigator.clipboard.writeText(branchName)
            console.log(`Branchname '${branchName}' copied to clipboard`)
        }, false)
    });
})();


