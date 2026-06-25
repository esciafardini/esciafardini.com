WARNING: This is a somewhat advanced Clojure topic. I'm not going to explain clojure or LISP or functional programming here. This is a selfish blogpost about a topic that trips me up so I can return to it later and solidify my understanding of (deep breath):

## Transducers

I see transducers (aka 'xforms') all the time. One wizard I worked with would use transducers nearly every time they called the `into` fn. Look at this Clojure source code:
```clojure
(defn into
  "Returns a new coll consisting of to with all of the items of
  from conjoined. A transducer may be supplied.
  (into x) returns x. (into) returns []."
  {:added "1.0"
   :static true}
  ([] [])
  ([to] to)
  ([to from]
     (if (instance? clojure.lang.IEditableCollection to)
       (with-meta (persistent! (reduce conj! (transient to) from)) (meta to))
       (reduce conj to from)))
  ([to xform from]
     (if (instance? clojure.lang.IEditableCollection to)
       (let [tm (meta to)
             rf (fn
                  ([coll] (-> (persistent! coll) (with-meta tm)))
                  ([coll v] (conj! coll v)))]
         (transduce xform rf (transient to) from))
       (transduce xform conj to from))))
```
Do you see it? You can pass an xform (transducer) between the `to` and `from` arguments. 

***Question***

What is an xform?

***Answer***

Think of it like this: `xform` sounds a lot like `transform`. We can use an `xform` to change one thing into a different thing. The term `xform` is short for `transducer` - a special fn similar to a `reducer`. Think of the `transducer` as a set of instructions used to transform data - ONE item at a time.

Repeating myself sort of, but with `into`, items get pushed through the transducer one at time. The transducer describes what to do with EACH item (and it CAN handle a single item that isn't part of a collection - it works with both collections and single items).

Here is a snippet of some god-tier code that I use at work:
```clojure
my-xform (transduce 
           (comp 
             (map (apply juxt coll-ks)) ;; seems incomplete doesn't it? (map fn)?
             (distinct)
             (partition-all 20000)
             (map coll2-fn) ;; this isn't thread-last, what's going on here?
             cat)
           conj ;; wtf is this
           [] 
           coll)
```
It's god-tier because I don't understand it. What's with this conj at the end? 

Apparently, transduce can call a completion fn. At the end it invokes the 1-arg arity of the reducing fn to flush. I don't fully grok this - maybe we can return to it later.

```clojure
;; TODO: understand the completion fn in Transducers
```
Clojure docs on transducers:
```clojure
;;As a mnemonic, remember that the ordering of transducer functions in comp is the same order as sequence transformations in ->>. The transformation above is equivalent to the sequence transformation:
(->> coll
     (filter odd?)
     (map inc)
     (take 5))
```

One thing of note that is *very* important and *very* confusing: `comp` flows left to right for fn calls in a transducer. This is opposite of what I am accustomed to when using `comp`.

```markdown
Strictly, comp always composes the same way.

Honestly, I have no idea what this means, but it seems important.

TODO: grok this too - so many pitfalls to stumble into when considering (into in xform out)
```

INTERESTING. `Transduce` can be called the same way `Reduce` is but with a per-item transformation function.
That's a key point here - the xform function is called **PER-ITEM**. We don't have to be dealing with collections here.
If filter is called on an async/chan that takes a single value - the filter step will still work `(filter odd?)` will remove the single even number
If map is called on a channel that takes a single value - the map step will still work `(map inc)` will increment the single value

If I'm repeating myself it's because I want so badly to hammer this into my brain.

TRANSDUCE fns happen PER ITEM.
MAP doesn't mean MAP over a collection in a transducer.
FILTER doesn't mean FILTER items in a collection in a transducer.
It's just an instruction for a single item (MAYBE that item is in a collection - MAYBE NOT).

# TODO
- I understand the basics of into in xform out
- I want to understand the flush fn (conj)
- I want to understand the non-collection version - maybe limited to async chan
- I want to understand what is meant by "strictly the same, despite difference in order of eval"
- I want to fully grok how assoc-coll-maps works
