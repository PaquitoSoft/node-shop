require 'rspec'
require 'watir-webdriver'

describe 'Home Page' do	
	let(:browser) { @browser ||= Watir::Browser.new }
	let(:root_categories_selector) { @root_categories_selector ||= '#main-menu li' }
	let(:subcategories_groups_selector_hidden) { @subcategories_groups_selector_hidden ||= '#main-menu li .accordion-content.invisible' }
	let(:main_products_selector) { @main_products_selector ||= '.product-grid ._product-summary' }
	
	def check_initial_state
		els = browser.elements :css => root_categories_selector
		expect(els.length).to eq 3
		els = browser.elements :css => subcategories_groups_selector_hidden
		expect(els.length).to eq 3
		els = browser.elements :css => main_products_selector
		expect(els.length).to eq 9
	end

	def get_elements(selector, parent_element = browser)
		parent_element.elements :css => selector
	end

	def get_element(selector, parent_element = browser)
		get_elements(selector, parent_element)[0]
	end

	def get_random_element(elementsOrSelector, parent_element = browser)
		elements = elementsOrSelector
		if elements.instance_of? String then
			elements = get_elements(elementsOrSelector, parent_element)
		end
		elements[rand(0..elements.length)]
	end

	before { browser.goto 'http://localhost:3000' }

	after { browser.close }

	it 'Should load home page' do

		# Check initial state
		check_initial_state()

		# Click a random root category
		get_random_element('#main-menu li .accordion-button').click

		# Check navigation tree is unfolded
		expect(get_elements(subcategories_groups_selector_hidden).length).to eq 2

	end

	xit 'Should load home page and navigate to one category' do

		# Check initial state
		check_initial_state()

		# Get and click a random root category

		# Get and click a random subcategory

		# Check we've navigated to category page (page heading title matches and has products count element)		
		
	end

	xit 'Should load home page and navigate to one main product' do
		
		# Check initial state
		check_initial_state()

		# Get and click a random main product

		# Check we've navigated to product page (product name matches)

	end

end

# Watir-webdriver docs: http://www.rubydoc.info/gems/watir-webdriver/Watir
# Watir code: https://github.com/watir/watir-webdriver
# Homepages: http://watirwebdriver.com/ and http://watir.com/
