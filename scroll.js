// Author(s): Dylan Turner <dylan.turner@tutanota.com>
// Implement project carousel scroll

class Project {
    constructor(title, id, imgSrc, lines) {
        this.title = title;
        this.id = id;
        this.imgSrc = imgSrc;
        this.lines = lines;
    }
}

function main() {
    // Parse project content
    let req = new XMLHttpRequest();
    let success = 0;
    while (success != 200) {
        req.open('GET', 'projs.txt', false);
        req.send();
        success = req.status;
    }
    let projTxts = req.responseText.split('\n#$#\n');
    let projs = [];
    for (let projTxt of projTxts) {
        let lines = projTxt.split('\n');
        projs.push(new Project(lines[0], lines[1], lines[2], lines.slice(3)));
    }

    // Add a CSS scroll variable
    let stallPerc = 0.5;
    window.addEventListener(
        'scroll',
        () => {
            // Raw percentage of scroll
            let scroll = window.pageYOffset / (document.body.offsetHeight - window.innerHeight);

            // Smooth it out to stop on each project
            // Basically, scroll normally except lock the value in the imgFirst part of each project
            // With the exception of the imgFirst project which scrolls for a sec imgFirst
            let scrollRel = scroll * projs.length;
            if (scrollRel >= 1.0 && scrollRel - Math.floor(scrollRel) < stallPerc) {
                scroll = Math.floor(scrollRel) / projs.length;
            }

            document.body.style.setProperty('--scroll', scroll);
        }, false
    );

    // Have the CSS animations adjust based on len
    let imgFirst = 'opacity: 100; top: 360px; left: 18px';
    let imgInvis = 'opacity: 0; top: -300px; left: -300px;';
    let imgVis = 'opacity: 100; top: 80px; left: 20px;';
    let txtFirst = 'opacity: 100; bottom: 120px; right: 22px'
    let txtInvis = 'opacity: 0; bottom: -300px; right: -300px;'
    let txtVis = 'opacity: 100; bottom: 100px; right: 22px;';
    let spacing = 100.0 / projs.length;
    let styleSheet = document.createElement('style');
    document.head.appendChild(styleSheet);
    for (let i = 0; i < projs.length; i++) {
        let proj = projs[i];
        let imgRule =
            '@keyframes ' + proj.id + ' {\n'
                + (i != 0 ?
                    '\t0% { ' + imgInvis + ' }\n'
                        + '\t' + Math.floor(i * spacing - 5).toString()
                            + '% { ' + imgInvis + ' }\n'
                        + '\t' + Math.floor(i * spacing).toString() + '% { ' + imgVis + ' }\n' :
                    '\t0% { ' + imgFirst + ' }\n'
                        + '\t2% { ' + imgVis + ' }\n'
                        + '\t7% { ' + imgVis + ' }\n')
                + '\t' + Math.floor((i + 1) * spacing).toString() + '% { ' + imgInvis + ' }\n'
                + '\t100% { ' + (i < projs.length - 1 ? imgInvis : imgVis) + ' }\n'
                + '}\n';
        styleSheet.sheet.insertRule(imgRule, styleSheet.sheet.cssRules.length);
        let txtRule =
            '@keyframes ' + proj.id + '_blurb {\n'
                + (i != 0 ?
                    '\t0% { ' + txtInvis + ' }\n'
                        + '\t' + Math.floor(i * spacing - 5).toString()
                            + '% { ' + txtInvis + ' }\n'
                        + '\t' + Math.floor(i * spacing).toString() + '% { ' + txtVis + ' }\n' :
                    '\t0% { ' + txtFirst + ' }\n'
                        + '\t2% { ' + txtVis + ' }\n'
                        + '\t7% { ' + txtVis + ' }\n')
                + '\t' + Math.floor((i + 1) * spacing).toString() + '% { ' + txtInvis + ' }\n'
                + '\t100% { ' + (i < projs.length - 1 ? txtInvis : txtVis) + ' }\n'
                + '}\n';
        styleSheet.sheet.insertRule(txtRule, styleSheet.sheet.cssRules.length);
    }

    // Create images for each project
    for (let proj of projs) {
        let img = document.createElement('img');
        img.src = proj.imgSrc;
        let projImg = document.createElement('div');
        projImg.id = proj.id;
        projImg.className = 'proj-img';

        projImg.style.animation = proj.id + ' 1s ease-in-out';
        projImg.style.animationPlayState = 'paused';
        projImg.style.animationDelay = 'calc(var(--scroll) * -1s)';
        projImg.style.animationIterationCount = '1';
        projImg.style.animationFillMode = 'both';

        projImg.appendChild(img);
        document.body.appendChild(projImg);
    }

    // Create text blurbs for each project
    for (let proj of projs) {
        let blurb = document.createElement('div');
        blurb.className = 'proj-blurb';
        blurb.id = proj.id + '_blurb';

        let title = document.createElement('h3');
        title.innerText = proj.title;
        blurb.appendChild(title);
        for (let line of proj.lines.slice(0, -1)) {
            let p = document.createElement('p');
            p.innerText = line;
            blurb.appendChild(p);
        }
        let a = document.createElement('a');
        a.innerText = 'READ MORE HERE';
        a.href = proj.lines[proj.lines.length - 1];
        blurb.appendChild(a);

        blurb.style.animation = proj.id + '_blurb 1s ease-in-out';
        blurb.style.animationPlayState = 'paused';
        blurb.style.animationDelay = 'calc(var(--scroll) * -1s)';
        blurb.style.animationIterationCount = '1';
        blurb.style.animationFillMode = 'both';

        document.body.appendChild(blurb);
    }

    // Add a bunch of <br> to make the site actually be scrollable
    // since we're using position: fixed
    for (let i = 0; i < 100 * projs.length; i++) {
        document.body.appendChild(document.createElement('br'));
    }
}

