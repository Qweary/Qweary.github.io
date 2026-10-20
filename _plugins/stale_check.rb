# Local-build warning for season-bound copy past its data-expires date.
# See assets/js/staleness.js for the convention.
#
# GitHub Pages runs in safe mode and ignores _plugins entirely, so this only
# fires on local builds (`jekyll build` / `jekyll serve`). It never fails the
# build; it only logs a warning per expired block.
require "date"

Jekyll::Hooks.register [:pages, :documents], :post_render do |doc|
  next unless doc.output.is_a?(String) && doc.output.include?("data-expires")
  today = Date.today
  doc.output.scan(/data-expires\s*=\s*["'](\d{4}-\d{2}-\d{2})["']/).flatten.each do |d|
    begin
      expires = Date.iso8601(d)
    rescue ArgumentError
      Jekyll.logger.warn "Staleness:", "#{doc.relative_path}: unreadable data-expires=\"#{d}\""
      next
    end
    if today >= expires
      Jekyll.logger.warn "Staleness:", "#{doc.relative_path}: block expired #{d}; review that copy"
    end
  end
end
