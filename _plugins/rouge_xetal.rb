# frozen_string_literal: true
#
# A Rouge lexer for X_eTaL, so ```xetal code blocks are colored as text:
# copyable, searchable Unicode, one copy of each snippet.
#
# It follows the token classes of X_eTaL's own renderer (`xetal render
# --html`: c-builtin, c-userfunc, c-libfunc, c-lambdaarg, c-number,
# c-string, c-symbol, c-macro, c-comment, c-doc, c-error) for both the drawn
# form (ᵘa̲vg ← ['+ r̲/ ÷ t̲ally]) and the typed ASCII (u:a_vg := ['+ r_/ / t_ally]),
# and colors diagnostics (error[...], warning[...], their --> and | lines).
# The colors are in assets/main.scss, "X_eTaL code blocks".

require "rouge"

module Rouge
  module Lexers
    class Xetal < RegexLexer
      title "X_eTaL"
      desc "X_eTaL, an APL-family array language typed in ASCII and drawn as notation"
      tag "xetal"
      aliases "xtl"
      filenames "*.xtl", "*.xtlm"

      SUP = "ᵃᵇᶜᵈᵉᶠᵍʰⁱʲᵏˡᵐⁿᵒᵖʳˢᵗᵘᵛʷˣʸᶻᴬᴮᴰᴱᴳᴴᴵᴶᴷᴸᴹᴺᴼᴾᴿᵀᵁⱽᵂ"
      UL = "̲"
      SUB = "₀₁₂₃₄₅₆₇₈₉"
      # A drawn name: letters, digits and underscores, one letter underlined.
      DRAWN = /(?:[[:alnum:]_]#{UL}?)*[[:alpha:]]#{UL}(?:[[:alnum:]_]#{UL}?)*/
      SYMBOLS = "←→÷×≤≥≠∧∨¬−◆▷▹⍴⍳⌈⌊∘⊂⊃∊⍉⌽⊖⍋⍒∇∆⊤⊥⍪⌿⍀⍨⍤⍥"

      state :root do
        # A shell command in a transcript ($ xetal run file.xtl).
        rule %r/^\$ .*$/, Generic::Prompt

        # Diagnostics, as xetal prints them.
        rule %r/^(?:error|warning)(?:\[[^\]\n]*\])?:.*$/, Generic::Error
        rule %r/^\s*(?:-->|= (?:help|note):|note:|help:).*$/, Generic::Output
        rule %r/^\s*\d+ \|(?: .*)?$|^\s+\|(?: .*)?$/, Generic::Output
        rule %r/^\d+ warning\(s\), \d+ error\(s\)$/, Generic::Output

        # Comments: ⍝│ and ## document, ### heads a section, ⍝ and # remark.
        rule %r/⍝│.*$|##(?!#).*$/, Comment::Special
        rule %r/###.*$/, Comment::Preproc
        rule %r/[⍝#].*$/, Comment::Single

        # Strings, including raw r"..." and code c"..." strings.
        rule %r/[rc]?"(?:\\.|[^"\\\n])*"/, Str

        # Namespaced names: drawn (ᵘa̲vg, ᵃᶜt̲hreshold, ᶜY̲<) and typed (u:a_vg, c:Y_<).
        rule %r/[#{SUP}]+#{DRAWN}[!?]?[\/\\-]?[#{SUB}]*</, Name::Decorator
        rule %r/ᵘ#{DRAWN}[!?]?/, Name::Function
        rule %r/[#{SUP}]+#{DRAWN}[!?]?[\/\\-]?[#{SUB}]*/, Name::Class
        rule %r/\b[a-zA-Z][a-zA-Z0-9]*:[a-zA-Z0-9]*_[a-zA-Z0-9_]*[!?]?</, Name::Decorator
        rule %r/\bu:[a-zA-Z0-9]*_[a-zA-Z0-9_]*[!?]?/, Name::Function
        rule %r/\b[a-zA-Z][a-zA-Z0-9]*:[a-zA-Z0-9]*_[a-zA-Z0-9_]*[!?]?/, Name::Class

        # Lambda arguments: ⍺ ⍵ ▁, typed _l _r _u.
        rule %r/[⍺⍵▁]|\b_[lru]\b/, Name::Variable::Magic

        # Built-ins and macros: drawn (r̲ange, r̲/, u̲se<) and typed (r_ange, r_/, u_se<).
        rule %r/#{DRAWN}[!?]?[\/\\-]?[#{SUB}]*</, Name::Decorator
        rule %r/#{DRAWN}[!?]?[\/\\-]?[#{SUB}]*/, Name::Builtin
        rule %r/\b[a-zA-Z][a-zA-Z0-9]*_(?:[a-zA-Z0-9]+[!?]?|[\/\\])(?:_\d+)?</, Name::Decorator
        rule %r/\b[a-zA-Z][a-zA-Z0-9]*_(?:[a-zA-Z0-9]+[!?]?|[\/\\])(?:_\d+)?/, Name::Builtin

        # Numbers (¯ is APL's high minus) and axis subscripts.
        rule %r/¯?\d+(?:\.\d+)?(?:[eE][-¯]?\d+)?|[#{SUB}]+/, Num

        rule %r/←|→|:=|->|[#{SYMBOLS}]|['~?!+\-*\/%<>=&|^,;:.@\\]/, Operator
        rule %r/[(){}\[\]]/, Punctuation
        rule %r/[[:alpha:]_][[:alnum:]_]*/, Name
        rule %r/\n/, Text
        rule %r/[ \t]+/, Text
        rule %r/./, Text
      end
    end
  end
end
