require 'rspec'
require 'rspec/core/formatters/documentation_formatter'

browsers = ['safari', 'chrome', 'firefox']
# browsers = ['safari']

def create_configuration
	config = RSpec::Core::Configuration.new

	formatter = RSpec::Core::Formatters::DocumentationFormatter.new(config.output_stream)

	# Create the reporter
	reporter = RSpec::Core::Reporter.new(config)
	config.instance_variable_set(:@reporter, reporter)

	#  Internal hack
	# api may not be stable; make sure you lock down RSpec version
	loader = config.send(:formatter_loader)
	notifications = loader.send(:notifications_for, RSpec::Core::Formatters::DocumentationFormatter)

	reporter.register_listener(formatter, *notifications)

	config.add_setting :browser

	return config
end

def get_specs_list
	# TODO Implementation pending
	list = ['spec/e2e/src/catalog/home_spec.rb']
	return list
end

def create_runner_options(config)
	options = RSpec::Core::ConfigurationOptions.new(get_specs_list)
	options.configure(config)
	return options
end

def run_suite(browser)
	puts "Running tests in: #{browser}"
	RSpec.world.reset
	config = create_configuration
	config.browser = browser
	RSpec.configuration = config
	runner = RSpec::Core::Runner.new(create_runner_options(config), config)
	runner.run($stderr, $stdout)
end


# Run tests in every configured browser
browsers.each do |browser|
	run_suite(browser)
end

# threads = browsers.map do |browser|
# 	Thread.new(browser) do |b|
# 		ENV['_node-shop-e2e-test-browser'] = b
# 		run_suite(b)
# 	end
# end

# threads.each {|t| t.join}


# Based on this gist -> https://gist.github.com/activars/4467752