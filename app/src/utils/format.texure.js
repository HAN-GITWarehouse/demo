'use strict';
const chalk = require('chalk');
const { v4: uuidv4 } = require('uuid');
const fs = require('fs');
const path = require('path')

module.exports = () => {
    var page_base = "./public/assets/pages"

    console.log(chalk.blue("texture json 数据 UUID 自动生成工具开始执行"))
    console.log(chalk.green(`json文件目录： ${page_base}`))

    fs.readdir(page_base, function (err, files) {
        if (files == null) {
            console.log(chalk.red("pages path error!", err))
            return
        }

        console.log(chalk.green("load page, sub path size: "), chalk.yellow(files.length))

        for (const f of files) {
            console.log(chalk.green("\nload page, find path: "), chalk.yellow(f))
            const source_path = `${page_base}/${f}`;
            const cn_path = `${source_path}/pc/cn`;
            const source_texture_filename = `${source_path}/texture.json`
            const dist_texture_filename = `${cn_path}/texture.json`

            if (!fs.existsSync(cn_path)) {
                fs.mkdirSync(cn_path, { recursive: true })
            }

            console.log(chalk.green(`renname sub files path:`, chalk.yellow(`${source_path}\n`)));
            const subFiles = fs.readdirSync(source_path);
            subFiles.forEach((v, i) => {
                const source = `${source_path}/${v}`;
                const dist = `${cn_path}/${v}`;

                const stat = fs.lstatSync(source);
                if (stat.isDirectory() !== true) {
                    console.log(chalk.green(`move file, source:${source} to dist:${dist}`));
                    if (fs.existsSync(dist)) {
                        fs.unlinkSync(dist);
                    }

                    fs.renameSync(source, dist);
                }
            });

            console.log(chalk.green(`gen uuid in ${dist_texture_filename}.`));
            fs.stat(dist_texture_filename, function (err, stat) {
                if (err != null) {
                    console.log(chalk.red("load page, json file not found: ", dist_texture_filename))
                    return
                }
                console.log(chalk.green("\nload json file: "), chalk.yellow(source_texture_filename))

                const textures = JSON.parse(fs.readFileSync(dist_texture_filename, 'utf8'));

                console.log(chalk.green(`load page, find background: `), chalk.yellow(`${textures.id}`))

                textures.id = f
                if (textures.content !== undefined && textures.content.texture_id !== undefined) {
                    textures.content.id = uuidv4();
                    textures.content.texture_id = textures.id;
                }

                textures.frames.forEach((element, index) => {
                    element.id = uuidv4();
                    element.texture_id = textures.id;
                    element.frame.id = uuidv4();
                    element.frame.texture_frames_id = element.id;
                });

                var jsonContent = JSON.stringify(textures);
                // console.log(jsonContent);

                fs.writeFile(dist_texture_filename, jsonContent, 'utf8', function (err) {
                    if (err) {
                        console.log(chalk.red("An error occured while writing JSON Object to File."));
                        return console.log(chalk.red(err));
                    }

                    console.log(chalk.green(`\nJSON file has been saved: `), chalk.yellow(`${dist_texture_filename}`));
                });
            })
        }
    })
}