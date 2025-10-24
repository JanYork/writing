/**
 * Hexo 媒体查询标签插件
 * 支持多种媒体查询语法
 */

const { escapeHTML } = require('hexo-util');

function parseMediaQuery(query) {
    if (!query) return 'all';
    
    // 预定义查询
    const predefined = {
        'mobile': '(max-width: 767px)',
        'tablet': '(min-width: 768px) and (max-width: 1023px)',
        'desktop': '(min-width: 1024px)',
        'all': 'all'
    };
    
    if (predefined[query]) {
        return predefined[query];
    }
    
    // 处理组合查询
    if (query.includes(',')) {
        const queries = query.split(',').map(q => q.trim());
        const mediaQueries = queries.map(q => {
            if (predefined[q]) {
                return predefined[q];
            }
            return q; // 自定义查询
        });
        return mediaQueries.join(', ');
    }
    
    // 自定义查询
    return query;
}

function mediaTag(args, content) {
    const query = args[0] || 'all';
    const mediaQuery = parseMediaQuery(query);
    const id = 'media-' + Math.random().toString(36).substr(2, 9);
    
    return `
<div class="media-query-container" data-media="${escapeHTML(mediaQuery)}" id="${id}">
    <style>
        @media not ${mediaQuery} {
            #${id} {
                display: none !important;
            }
        }
    </style>
    ${content}
</div>`;
}

// 注册主标签
hexo.extend.tag.register('media', mediaTag, {ends: true});

// 注册简化标签
hexo.extend.tag.register('mobile', function(args, content) {
    return mediaTag(['mobile'], content);
}, {ends: true});

hexo.extend.tag.register('desktop', function(args, content) {
    return mediaTag(['desktop'], content);
}, {ends: true});

hexo.extend.tag.register('tablet', function(args, content) {
    return mediaTag(['tablet'], content);
}, {ends: true});

// 注册组合标签
hexo.extend.tag.register('mobile-tablet', function(args, content) {
    return mediaTag(['mobile,tablet'], content);
}, {ends: true});

hexo.extend.tag.register('desktop-tablet', function(args, content) {
    return mediaTag(['desktop,tablet'], content);
}, {ends: true});

// 注册自定义媒体查询标签
hexo.extend.tag.register('media-custom', function(args, content) {
    const query = args.join(' ');
    return mediaTag([query], content);
}, {ends: true});
